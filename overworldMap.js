class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects || []
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
    const nextPosition = utils.nextPosition(currentX, currentY, direction)
    return this.walls[nextPosition.join(',')] || false
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key]
      object.id = key

      object.mount(this)
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i]
      })

      await eventHandler.init()
    }


    this.isCutscenePlaying = false

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  addWall(coordinates) {
    this.walls[coordinates.join(',')] = true
  }

  removeWall(coordinates) {
    delete this.walls[coordinates.join(',')]
  }

  moveWall(initialCoordinates, direction) {
    this.removeWall(initialCoordinates)
    const nextPosition = utils.nextPosition(initialCoordinates[0], initialCoordinates[1], direction)
    this.addWall(nextPosition)
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"]

    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction)
    const match = Object.values(this.gameObjects).find(object => {
      return object.x === nextCoords[0] &&
        object.y === nextCoords[1]
    })

    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
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
    lowerSrc: './images/maps/DemoLower.png',
    upperSrc: './images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        x: utils.withGrid(5),
        y: utils.withGrid(5),
        isPlayerControlled: true,
      }),
      npc1: new Person({
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
            events: [
              { type: "textMessage", text: "Hello!", faceHero: "npc1" },
              { type: "textMessage", text: "HELLOOOOOO!" },
              { type: "battle", enemyId: "beth" },
              // { type: "walk", direction: "up", who: "hero" },
            ]
          },
        ]
      }),
      npcA: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: './images/characters/people/erio.png',
        talking: [
          {
            events: [
              { type: "textMessage", text: "HELLOOOOOO!", faceHero: "npcA" },
              { type: "battle", enemyId: "erio" },
            ]
          }
        ]
      }),
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
            { type: "changeMap", map: "Kitchen" },
          ]
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: './images/maps/KitchenLower.png',
    upperSrc: './images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(6),
        src: './images/characters/people/npc2.png',
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: './images/characters/people/npc3.png',
      })
    }
  }
}