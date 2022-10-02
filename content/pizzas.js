window.PizzaTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill"
}

window.Pizzas = {
  "s001": {
    name: "Slice Samurai",
    type: PizzaTypes.spicy,
    description: "A pizza",
    src: "images/characters/pizzas/s001.png",
    icon: "/images/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"]
  },
  "s002": {
    name: "Bacon Brigade",
    type: PizzaTypes.spicy,
    description: "A good pizza",
    src: "images/characters/pizzas/s002.png",
    icon: "/images/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"]
  },
  "v001": {
    name: "Call Me Kale",
    type: PizzaTypes.veggie,
    description: "A pizza",
    src: "images/characters/pizzas/v001.png",
    icon: "/images/icons/veggie.png",
    actions: ["damage1"]
  },
  "f001": {
    name: "Portobello Express",
    type: PizzaTypes.fungi,
    description: "A pizza",
    src: "images/characters/pizzas/f001.png",
    icon: "/images/icons/fungi.png",
    actions: ["damage1"]
  },

}