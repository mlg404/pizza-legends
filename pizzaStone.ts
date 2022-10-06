import { Pizza } from "content/pizzas";
import { GameObject } from "gameObject";
import { EventType } from "maps/interfaces";
import { Sprite } from "sprite";
import { playerState } from "state/playerState";

export class PizzaStone extends GameObject {
  public storyFlag: string;
  public pizzas: Pizza[];
  constructor(config: any) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "./images/characters/pizza-stone.png",
      animations: {
        "used-down": [[0, 0]],
        "unused-down": [[1, 0]],
      },
      currentAnimation: "used-down",
    });
    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: EventType.TEXT_MESSAGE, text: "You already used this." },
        ],
      },
      {
        events: [
          { type: EventType.TEXT_MESSAGE, text: "ME USA" },
          { type: EventType.CRAFTING_MENU, pizzas: this.pizzas },
          { type: EventType.ADD_STORY_FLAG, flag: this.storyFlag },
        ],
      },
    ];
  }

  update() {
    this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
      ? "used-down"
      : "unused-down";
  }

  init() {}
}
