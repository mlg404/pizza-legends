import { Event, Talking } from "maps/interfaces";
import { OverworldEvent } from "overworldEvent";
import { OverworldMap } from "overworldMap";
import { Sprite } from "./sprite";
import { DirectionsEnum } from "./utils";

interface GameObjectConfig {
  x: number;
  y: number;
  direction: DirectionsEnum;
  src: string;
  behaviorLoop: Event[];
  talking: Talking[];
}

export class GameObject {
  public id: string | null;
  public isMounted: boolean;
  public x: number;
  public y: number;
  public direction: DirectionsEnum;
  public sprite;
  public behaviorLoop: Event[];
  public behavioLoopIndex;
  public talking;
  public retryTimeout: number | null;

  constructor(config: GameObjectConfig) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./images/characters/people/hero.png",
    });
    this.retryTimeout = null;

    this.behaviorLoop = config.behaviorLoop || [];
    this.behavioLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map: OverworldMap) {
    this.isMounted = true;

    window.setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 1000);
  }

  update() {}

  async doBehaviorEvent(map: OverworldMap) {
    if (this.behaviorLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      if (this.retryTimeout) {
        window.clearTimeout(this.retryTimeout);
      }
      this.retryTimeout = window.setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 1000);
      return;
    }

    let eventConfig = this.behaviorLoop[this.behavioLoopIndex];
    eventConfig.who = this.id!;

    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behavioLoopIndex += 1;
    if (this.behavioLoopIndex === this.behaviorLoop.length)
      this.behavioLoopIndex = 0;

    this.doBehaviorEvent(map);
  }
}
