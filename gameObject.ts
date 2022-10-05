import { Sprite } from "./sprite";
import { DirectionsEnum } from "./utils";

export class GameObject {
  public id;
  public isMounted: boolean;
  public x: number;
  public y: number;
  public direction: DirectionsEnum;
  public sprite;
  public behaviorLoop;
  public behavioLoopIndex;
  public talking;
  public retryTimeout: number | null;

  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./images/characters/people/hero.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behavioLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    this.isMounted = true;

    window.setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 1000);
  }

  update() {}

  async doBehaviorEvent(map) {
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
    eventConfig.who = this.id;

    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behavioLoopIndex += 1;
    if (this.behavioLoopIndex === this.behaviorLoop.length)
      this.behavioLoopIndex = 0;

    this.doBehaviorEvent(map);
  }
}
