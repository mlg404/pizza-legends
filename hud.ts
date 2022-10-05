class Hud {
  constructor() {
    this.scoreboards = []

  }

  update() {
    this.scoreboards.forEach(scoreboard => {
      scoreboard.update(window.playerState.pizzas[scoreboard.id])
    })
  }

  createElement() {
    if (this.element) {
      this.element.remove()
      this.scoreboards = []
    }
    this.element = document.createElement("div");
    this.element.classList.add("Hud")

    const { playerState } = window
    playerState.lineup.forEach(key => {
      const pizza = playerState.pizzas[key]

      const scoreboard = new Combatant({
        id: key,
        ...Pizzas[pizza.pizzaId],
        ...pizza
      }, null)
      scoreboard.createElement()
      this.scoreboards.push(scoreboard)
      this.element.appendChild(scoreboard.hudElement)
    })
    this.update()

  }

  createAndAppend(container) {
    this.createElement()
    container.appendChild(this.element)
  }

  init(container) {
    this.createAndAppend(container)

    document.addEventListener("PLayerStateUpdated", () => this.update())

    document.addEventListener("LineupChanged", () => this.createAndAppend(container))
  }

}