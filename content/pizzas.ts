export enum PizzaTypes {
  NORMAL = "normal",
  SPICY = "spicy",
  VEGGIE = "veggie",
  FUNGI = "fungi",
  CHILL = "chill",
}

interface Pizza {
  name: string;
  type: PizzaTypes;
  description: string;
  src: string;
  icon: string;
  actions: string[];
}

export const Pizzas: Record<string, Pizza> = {
  s001: {
    name: "Slice Samurai",
    type: PizzaTypes.SPICY,
    description: "A pizza",
    src: "./images/characters/pizzas/s001.png",
    icon: "./images/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"],
  },
  s002: {
    name: "Bacon Brigade",
    type: PizzaTypes.SPICY,
    description: "A good pizza",
    src: "./images/characters/pizzas/s002.png",
    icon: "./images/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"],
  },
  v001: {
    name: "Call Me Kale",
    type: PizzaTypes.VEGGIE,
    description: "A pizza",
    src: "./images/characters/pizzas/v001.png",
    icon: "./images/icons/veggie.png",
    actions: ["damage1"],
  },
  f001: {
    name: "Portobello Express",
    type: PizzaTypes.FUNGI,
    description: "A pizza",
    src: "./images/characters/pizzas/f001.png",
    icon: "./images/icons/fungi.png",
    actions: ["damage1"],
  },
};
