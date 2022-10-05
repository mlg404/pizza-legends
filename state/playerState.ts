import { Pizza } from "content/enemies";
import { emitEvent } from "utils";

class PlayerState {
  public static instance: PlayerState;

  public pizzas: Record<string, Pizza>;
  public lineup: string[];
  public items;
  public storyFlags: Record<string, boolean>;

  constructor() {
    this.pizzas = {
      p1: {
        pizzaId: "s001",
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null,
      },
    };
    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ];
    this.storyFlags = {};
  }

  public static getInstance(): PlayerState {
    if (!PlayerState.instance) {
      PlayerState.instance = new PlayerState();
    }

    return PlayerState.instance;
  }

  addPizza(pizzaId: string) {
    const newId = `p${Date.now()}${Math.floor(Math.random() * 99999)}`;
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 69,
      status: null,
    };

    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }

    emitEvent("LineupChanged");
  }

  moveToFront(idToFront: string) {
    this.lineup = this.lineup.filter((id) => id !== idToFront);
    this.lineup.unshift(idToFront);
    emitEvent("LineupChanged");
  }

  swapLineup(old: string, incoming: string) {
    const oldIndex = this.lineup.indexOf(old);
    this.lineup[oldIndex] = incoming;
    emitEvent("LineupChanged");
  }
}
const playerState = PlayerState.getInstance();

export { playerState };
