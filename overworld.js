class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector('.game-canvas');
    this.context = this.canvas.getContext('2d');
    this.map = null
  }

  startGameLoop() {
    const step = () => {

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)


      const cameraPerson = this.map.gameObjects.hero

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        })
      })

      this.map.drawLowerImage(this.context, cameraPerson)

      Object.values(this.map.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach(object => {
          object.sprite.draw(this.context, cameraPerson)
        })

      this.map.drawUpperImage(this.context, cameraPerson)

      requestAnimationFrame(() => {
        step()
      })
    }

    step()
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      this.map.checkForActionCutscene()
    })
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene()
      }
    })
  }

  startMap(map) {
    this.map = new OverworldMap(map)
    this.map.overworld = this
    this.map.mountObjects(map)
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom)

    this.bindActionInput()
    this.bindHeroPositionCheck()

    this.directionInput = new DirectionInput()
    this.directionInput.init()
    this.startGameLoop()


    // this.map.startCutscene([
    //   { type: "battle", enemyId: "beth" },
    // ])
  }
}