import { playerState } from "state/playerState";
import { Battle } from "./battle/battle";
import { Enemies } from "./content/enemies";
import { Event, MapsEnum } from "./maps/interfaces";
import { GameMaps } from "./maps/overworldMaps";
import { Person } from "./person";
import { SceneTransition } from "./sceneTransition";
import { TextMessage } from "./textMessage";
import { oppositeDirection } from "./utils";

interface OverworldEventProps {
  map: any;
  event: Event;
}
export class OverworldEvent {
  public map: any;
  public event: Event;
  constructor({ map, event }: OverworldEventProps) {
    this.map = map;
    this.event = event;
  }

  stand(resolve: any) {
    const who: Person = this.map?.gameObjects?.[this.event!.who!];
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

    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandingComplete", completeHandler);
  }

  walk(resolve: any) {
    const who = this.map?.gameObjects?.[this.event!.who!];
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

    const completeHandler = (e: any) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve: any) {
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

  changeMap(resolve: any) {
    Object.values(this.map.gameObjects).forEach(
      (obj: any) => (obj.isMounted = false)
    );

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(GameMaps[this.event.map as MapsEnum], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve: any) {
    const battle = new Battle({
      enemy: Enemies[this.event!.enemyId!],
      onComplete: (playerWin: string) =>
        resolve(playerWin ? "WON_BATTLE" : "LOST_BATTLE"),
    });
    battle.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve: any) {
    playerState.storyFlags[this.event!.flag!] = true;
    resolve();
  }

  pause(resolve: any) {
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

  craftingMenu(resolve: any) {
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
