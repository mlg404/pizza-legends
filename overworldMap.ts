import { Overworld } from "./overworld";
import { OverworldEvent } from "./overworldEvent";
import { nextPosition, withGrid } from "./utils";

export class OverworldMap {
  public overworld: Overworld | null;
  public gameObjects;
  public configObjects;

  public walls;
  public cutsceneSpaces;

  public lowerImage: HTMLImageElement;
  public upperImage: HTMLImageElement;
  public isCutscenePlaying: boolean;
  public isPaused: boolean;

  constructor(config) {
    this.overworld = null;
    this.gameObjects = {};
    this.configObjects = config.configObjects;

    this.walls = config.walls || {};
    this.cutsceneSpaces = config.cutsceneSpaces || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;

    this.isPaused = false;
  }

  drawLowerImage(context, cameraPerson) {
    context.drawImage(
      this.lowerImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(context, cameraPerson) {
    context.drawImage(
      this.upperImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const [x, y] = nextPosition(currentX, currentY, direction);
    if (this.walls[[x, y].join(",")]) return true;

    return Object.values(this.gameObjects).find((obj) => {
      const [intentX, intentY] = obj.intentPosition || [];
      if (obj.x === x && obj.y === y) return true;
      if (intentX === x && intentY === y) return true;
      return false;
    });
  }

  mountObjects() {
    const classes = {
      Person: Person,
      PizzaStone: PizzaStone,
    };
    Object.keys(this.configObjects).forEach((key) => {
      let object = this.configObjects[key];
      object.id = key;

      const instance = new classes[object.type](object);
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i],
      });

      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") break;
    }

    this.isCutscenePlaying = false;

    // Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];

    const [x, y] = nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return object.x === x && object.y === y;
    });

    if (this.isCutscenePlaying || !match || !match.talking.length) return;
    const relevantScenario = match.talking.find((scenario) =>
      (scenario.required || []).every((flag) => playerState.storyFlags[flag])
    );
    relevantScenario && this.startCutscene(relevantScenario.events);
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match && match.length) {
      this.startCutscene(match[0].events);
    }
  }
}
