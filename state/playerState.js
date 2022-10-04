class PlayerState {
  constructor() {
    this.pizzas = {
      "p1": {
        pizzaId: "s001",
        hp: 30,
        maxHp: 50,
        xp: 85,
        maxXp: 100,
        level: 1,
        status: { type: "saucy", expiresIn: 3 }
      },
      "p2": {
        pizzaId: "v001",
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null
      },
      "p3": {
        pizzaId: "f001",
        hp: 50,
        maxHp: 50,
        xp: 75,
        maxXp: 100,
        level: 1,
        status: null
      }
    }
    this.lineup = ["p1", "p2"]
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ]
    this.storyFlags = {}
  }

  addPizza(pizzaId) {
    const newId = `p${Date.now()}${Math.floor(Math.random() * 99999)}`
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 69,
      status: null
    }

    if (this.lineup.length < 3) {
      this.lineup.push(newId)
    }

    utils.emitEvent("LineupChanged")
  }

  moveToFront(idToFront) {
    this.lineup = this.lineup.filter(id => id !== idToFront)
    this.lineup.unshift(idToFront)
    utils.emitEvent("LineupChanged")

  }

  swapLineup(old, incoming) {
    const oldIndex = this.lineup.indexOf(old)
    this.lineup[oldIndex] = incoming
    utils.emitEvent("LineupChanged")

  }

}

window.playerState = new PlayerState()