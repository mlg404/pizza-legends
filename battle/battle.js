class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy
    this.onComplete = onComplete

    this.combatants = {
      // "player1": new Combatant({
      //   ...Pizzas.s001,
      //   team: "player",
      //   hp: 30,
      //   maxHp: 50,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: { type: "saucy", expiresIn: 3 },
      //   isPlayerControlled: true
      // }, this),
      // "player2": new Combatant({
      //   ...Pizzas.s002,
      //   team: "player",
      //   hp: 30,
      //   maxHp: 50,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      //   isPlayerControlled: true
      // }, this),
      // "enemy1": new Combatant({
      //   ...Pizzas.v001,
      //   team: "enemy",
      //   hp: 1,
      //   maxHp: 50,
      //   xp: 10,
      //   maxXp: 100,
      //   level: 2,
      //   status: null
      // }, this),
      // "enemy2": new Combatant({
      //   ...Pizzas.f001,
      //   team: "enemy",
      //   hp: 25,
      //   maxHp: 50,
      //   xp: 20,
      //   maxXp: 100,
      //   level: 1,
      //   status: null
      // }, this),
    }

    this.activeCombatants = {
      player: null, //"player1",
      enemy: null //"enemy1"
    }

    window.playerState.lineup.forEach(id => {
      this.addCombatant({ id, team: "player", config: window.playerState.pizzas[id] })
    })

    Object.keys(this.enemy.pizzas).forEach(key => {
      this.addCombatant({ id: `e_${key}`, team: "enemy", config: this.enemy.pizzas[key] })
    })



    this.items = []

    window.playerState.items.forEach(item => this.items.push({
      ...item,
      team: "player"
    }))

    this.usedInstanceIds = {}

  }

  addCombatant({ id, team, config }) {
    this.combatants[id] = new Combatant({
      ...Pizzas[config.pizzaId],
      ...config,
      team,
      isPlayerControlled: team === "player"
    }, this)

    this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.classList.add("Battle")
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="./images/characters/people/hero.png" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
      </div>
    
    
    `)
  }

  init(container) {
    this.createElement()
    container.appendChild(this.element)

    this.playerTeam = new Team("player", "Hero")
    this.enemyTeam = new Team("enemy", "Enemy")

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)

      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant)
      } else {
        this.enemyTeam.combatants.push(combatant)
      }
    })

    this.playerTeam.init(this.element)
    this.enemyTeam.init(this.element)

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve)
        })
      },
      onWinner: winner => {

        if (winner === "player") {
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id]
            const combatant = this.combatants[id]

            if (combatant) {
              playerStatePizza.hp = combatant.hp
              playerStatePizza.xp = combatant.xp
              playerStatePizza.maxXp = combatant.maxXp
              playerStatePizza.level = combatant.level
            }
          })

          playerState.items = playerState.items
            .filter(item => !this.usedInstanceIds[item.instanceId])

          utils.emitEvent("PLayerStateUpdated")
        }

        this.element.remove()
        this.onComplete(winner === "player")
      }
    })

    this.turnCycle.init()
  }
}