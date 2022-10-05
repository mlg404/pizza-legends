import { Battle } from "./battle/battle";
import { Enemies } from "./content/enemies";
import {
  BattleEvent,
  ChangeMapEvent,
  Event,
  Map,
  MapsEnum,
  StandEvent,
  WalkEvent,
} from "./maps/interfaces";
import { GameMaps } from "./maps/overworldMaps";
import { Person } from "./person";
import { SceneTransition } from "./sceneTransition";
import { TextMessage } from "./textMessage";
import { oppositeDirection } from "./utils";

interface OverworldEventProps {
  map: Map;
  event: Event;
}
export class OverworldEvent {
  public map: Map;
  public event: Event;
  constructor({ map, event }: OverworldEventProps) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who: Person = this.map?.gameObjects?.[(this.event as StandEvent).who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandingComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map?.gameObjects?.[(this.event as WalkEvent).who];
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    );

    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });

    message.init(document.querySelector(".game-container"));
  }

  changeMap(resolve) {
    Object.values(this.map.gameObjects).forEach(
      (obj) => (obj.isMouted = false)
    );

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(GameMaps[this.event.map as MapsEnum], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      } as ChangeMapEvent);
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[(this.event as BattleEvent).enemyId],
      onComplete: (playerWin) =>
        resolve(playerWin ? "WON_BATTLE" : "LOST_BATTLE"),
    });
    battle.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
      hero: this.map.gameObjects["hero"],
    });
    menu.init(document.querySelector(".game-container"));
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      pizzas: this.event.pizzas,
      onComplete: () => {
        resolve();
      },
    });
    menu.init(document.querySelector(".game-container"));
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve);
    });
  }
}
