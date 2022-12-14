class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}
    this.configObjects = config.configObjects


    this.walls = config.walls || {}
    this.cutsceneSpaces = config.cutsceneSpaces || {}

    this.lowerImage = new Image()
    this.lowerImage.src = config.lowerSrc

    this.upperImage = new Image()
    this.upperImage.src = config.upperSrc

    this.isCutscenePlaying = false

    this.isPaused = false
  }

  drawLowerImage(context, cameraPerson) {
    context.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y,
    )
  }

  drawUpperImage(context, cameraPerson) {
    context.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y,
    )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const [x, y] = utils.nextPosition(currentX, currentY, direction)
    if (this.walls[[x, y].join(',')]) return true

    return Object.values(this.gameObjects).find(obj => {
      const [intentX, intentY] = obj.intentPosition || []
      if (obj.x === x && obj.y === y) return true
      if (intentX === x && intentY === y) return true
      return false

    })
  }

  mountObjects() {
    const classes = {
      "Person": Person,
      "PizzaStone": PizzaStone,
    }
    Object.keys(this.configObjects).forEach(key => {
      let object = this.configObjects[key]
      object.id = key

      const instance = new classes[object.type](object)
      this.gameObjects[key] = instance
      this.gameObjects[key].id = key
      instance.mount(this)
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i]
      })

      const result = await eventHandler.init()
      if (result === "LOST_BATTLE") break
    }


    this.isCutscenePlaying = false

    // Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"]

    const [x, y] = utils.nextPosition(hero.x, hero.y, hero.direction)
    const match = Object.values(this.gameObjects).find(object => {
      return object.x === x && object.y === y
    })

    if (this.isCutscenePlaying || !match || !match.talking.length) return
    const relevantScenario = match.talking.find(
      scenario => (scenario.required || []).every(flag => playerState.storyFlags[flag]))
    relevantScenario && this.startCutscene(relevantScenario.events)

  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"]
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`]
    if (!this.isCutscenePlaying && match && match.length) {
      this.startCutscene(match[0].events)
    }
  }
}

window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    lowerSrc: './images/maps/DemoLower.png',
    upperSrc: './images/maps/DemoUpper.png',
    gameObjects: {},
    configObjects: {
      hero: {
        type: "Person",
        x: utils.withGrid(5),
        y: utils.withGrid(5),
        isPlayerControlled: true,
      },
      npc1: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: './images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'down', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'left', time: 1200 },
          { type: 'stand', direction: 'down', time: 300 },
        ],
        talking: [
          {
            required: ["TALKED_WITH_ERIO"],
            events: [
              { type: "textMessage", text: "MACHISTA!", faceHero: "npc1" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Hello!", faceHero: "npc1" },
              { type: "textMessage", text: "HELLOOOOOO!" },
              { type: "battle", enemyId: "beth" },
              { type: "addStoryFlag", flag: "DEFEATED_BETH" },
              { type: "textMessage", text: "You won... THIS TIME!" },
              // { type: "walk", direction: "up", who: "hero" },
            ]
          },
        ]
      },
      npcA: {
        type: "Person",
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: './images/characters/people/erio.png',
        talking: [
          {
            events: [
              { type: "textMessage", text: "HELLOOOOOO!", faceHero: "npcA" },
              // { type: "battle", enemyId: "erio" },
              { type: "addStoryFlag", flag: "TALKED_WITH_ERIO" },
            ]
          }
        ]
      },
      pizzaStone: {
        type: "PizzaStone",
        x: utils.withGrid(2),
        y: utils.withGrid(7),
        storyFlag: "USED_PIZZA_STONE",
        pizzas: ["v001", "f001"]
      },
      npc3: {
        type: "Person",
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        src: './images/characters/people/npc5.png',
        behaviorLoop: [
          { type: 'walk', direction: 'right' },
          { type: 'walk', direction: 'down' },
          { type: 'walk', direction: 'down' },
          { type: 'walk', direction: 'left' },
          { type: 'walk', direction: 'left' },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'up' },
          { type: 'walk', direction: 'right' },
          { type: 'stand', direction: 'up', time: 800 }
        ],
        talking: [
          {
            required: ["TALKED_WITH_ERIO"],
            events: [
              { type: "textMessage", text: "MACHISTA!", faceHero: "npc1" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Hello!", faceHero: "npc1" },
              { type: "textMessage", text: "HELLOOOOOO!" },
              { type: "battle", enemyId: "beth" },
              { type: "addStoryFlag", flag: "DEFEATED_BETH" },
              { type: "textMessage", text: "You won... THIS TIME!" },
              // { type: "walk", direction: "up", who: "hero" },
            ]
          },
        ]
      },
    },
    walls: {
      // Table
      ...utils.squarePath([7, 6], [8, 7]),

      // Bookshelf
      ...utils.linePath([3, 4], [4, 4]),

      // Wall
      ...utils.linePath([1, 3], [10, 3]),
      ...utils.linePath([0, 4], [0, 9]),
      ...utils.linePath([11, 4], [11, 9]),
      ...utils.linePath([1, 10], [4, 10]),
      ...utils.linePath([6, 10], [10, 10]),
      [utils.asGridCoords(5, 11)]: true,
      [utils.asGridCoords(6, 4)]: true,
      [utils.asGridCoords(8, 4)]: true,




    },
    cutsceneSpaces: {
      [utils.asGridCoords(7, 4)]: [
        {
          events: [
            { who: "npcA", type: "walk", direction: "left" },
            { who: "npcA", type: "stand", direction: "up" },
            { who: "npcA", type: "textMessage", text: "YOU CAN'T AFFORD THIS PLACE!" },
            { who: "npcA", type: "walk", direction: "right" },
            { who: "npcA", type: "stand", direction: "down" },
            { who: "hero", type: "walk", direction: "down" }
          ]
        }
      ],
      [utils.asGridCoords(5, 10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(2),
              y: utils.withGrid(2),
              direction: "down"
            },
          ]
        }
      ]
    }
  },
  Kitchen: {
    id: "Kitchen",
    lowerSrc: './images/maps/KitchenLower.png',
    upperSrc: './images/maps/KitchenUpper.png',
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      },
      npcA: {
        type: "Person",
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: './images/characters/people/npc2.png',
      },
      npcB: {
        type: "Person",
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: './images/characters/people/npc3.png',
      }
    },
    cutsceneSpaces: {
      [utils.asGridCoords(5, 10)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Street",
              x: utils.withGrid(29),
              y: utils.withGrid(9),
              direction: 'down'
            },
          ]
        }
      ]
    }
  },
  Street: {
    id: "Street",
    lowerSrc: './images/maps/StreetLower.png',
    upperSrc: './images/maps/StreetUpper.png',
    configObjects: {
      hero: {
        type: "Person",
        x: utils.withGrid(30),
        y: utils.withGrid(10),
        isPlayerControlled: true,
      },
    },
    cutsceneSpaces: {
      [utils.asGridCoords(29, 9)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Kitchen",
              x: utils.withGrid(5),
              y: utils.withGrid(10),
              direction: 'up'
            },
          ]
        }
      ]

    }
  }
}