interface OverworldProps {
  element: HTMLElement;
}
export class Overworld {
  public element: HTMLElement;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public map: any;

  constructor(config: OverworldProps) {
    this.element = config.element;
    this.canvas = this.element.querySelector(
      ".game-canvas"
    ) as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.map = null;
  }

  startGameLoop(): void {
    const step = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cameraPerson = this.map.gameObjects.hero;

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

      this.map.startCutscene([{ type: "pause" }]);
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(map, heroInitialState = null) {
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
    const container = document.querySelector(".game-container");

    this.progress = new Progress();

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

    this.hud = new Hud();
    this.hud.init(container);

    this.startMap(window.OverworldMaps[this.progress.mapId], initialHeroState);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.startGameLoop();

    // this.map.startCutscene([
    //   { type: "battle", enemyId: "beth" },
    // ])
  }
}
