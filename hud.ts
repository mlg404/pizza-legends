import { Combatant } from "battle/combatant";
import { Pizzas } from "content/pizzas";
import { playerState } from "state/playerState";

export class Hud {
  public scoreboards: Combatant[];
  public element: HTMLDivElement;
  constructor() {
    this.scoreboards = [];
    this.element = {} as HTMLDivElement;
  }

  update() {
    this.scoreboards.forEach((scoreboard) => {
      scoreboard.update(playerState.pizzas[scoreboard.id]);
    });
  }

  createElement() {
    if (this.element) {
      this.element.remove();
      this.scoreboards = [];
    }
    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    playerState.lineup.forEach((key) => {
      const pizza = playerState.pizzas[key];

      const scoreboard = new Combatant(
        {
          id: key,
          ...Pizzas[pizza.pizzaId],
          ...pizza,
        },
        null
      );
      scoreboard.createElement();
      this.scoreboards.push(scoreboard);
      this.element!.appendChild(scoreboard.hudElement);
    });
    this.update();
  }

  createAndAppend(container: HTMLDivElement) {
    this.createElement();
    container.appendChild(this.element);
  }

  init(container: HTMLDivElement) {
    this.createAndAppend(container);

    document.addEventListener("PLayerStateUpdated", () => this.update());

    document.addEventListener("LineupChanged", () =>
      this.createAndAppend(container)
    );
  }
}
