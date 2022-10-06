import { DirectionInput } from "directionInput";
import { Hud } from "hud";
import { EventType, Map } from "maps/interfaces";
import { Person } from "person";
import { Progress } from "progress";
import { TitleScreen } from "titleScreen";
import { GameMaps } from "./maps/overworldMaps";
import { OverworldMap } from "./overworldMap";
import { DirectionsEnum } from "./utils";

interface OverworldProps {
  element: HTMLElement;
}

interface HeroInitialState {
  x: number;
  y: number;
  direction: DirectionsEnum;
}
export class Overworld {
  public element: HTMLElement;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public map: OverworldMap;
  public directionInput: DirectionInput;
  public progress: Progress;
  public titleScreen: TitleScreen;
  public hud: Hud;

  constructor(config: OverworldProps) {
    this.map = {} as OverworldMap;
    this.element = config.element;
    this.canvas = this.element.querySelector(
      ".game-canvas"
    ) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.directionInput = new DirectionInput();
    this.progress = new Progress();
    this.titleScreen = {} as TitleScreen;
    this.hud = new Hud();
  }

  startGameLoop(): void {
    const step = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cameraPerson = this.map.gameObjects.hero as Person;

      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      this.map.drawLowerImage(this.context, cameraPerson);

      Object.values(this.map.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach((object) => {
          object.sprite.draw(this.context, cameraPerson);
        });

      this.map.drawUpperImage(this.context, cameraPerson);

      if (this.map.isPaused) return;
      requestAnimationFrame(() => {
        step();
      });
    };

    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutscene();
    });
    new KeyPressListener("Escape", () => {
      if (this.map.isCutscenePlaying) return;

      this.map.startCutscene([{ type: EventType.PAUSE }]);
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e: any) => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(map: Map, heroInitialState: HeroInitialState | null = null) {
    this.map = new OverworldMap(map);
    this.map.overworld = this;
    this.map.mountObjects();

    if (heroInitialState) {
      const { hero } = this.map.gameObjects;
      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction;
    }

    this.progress.mapId = map.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  async init() {
    const container = document.querySelector(
      ".game-container"
    ) as HTMLDivElement;

    this.titleScreen = new TitleScreen({
      progress: this.progress,
    });

    const useSaveFile = await this.titleScreen.init(container);

    let initialHeroState = null;
    if (useSaveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      };
    }

    this.hud.init(container);

    this.startMap(GameMaps[this.progress.mapId], initialHeroState);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput.init();
    this.startGameLoop();

    // this.map.startCutscene([
    //   { type: "battle", enemyId: "beth" },
    // ])
  }
}
