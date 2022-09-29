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

      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.context, cameraPerson)
      })

      this.map.drawUpperImage(this.context, cameraPerson)

      requestAnimationFrame(() => {
        step()
      })
    }

    step()
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom)
    this.map.mountObjects()
    this.directionInput = new DirectionInput()
    this.directionInput.init()
    this.startGameLoop()
  }
}