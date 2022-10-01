class RevealingText {
  constructor(config) {
    this.element = config.element
    this.text = config.text
    this.speed = config.speed || 30


    this.timeout = null
    this.isDone = false
  }

  async revealOneCharacter(characters) {
    this.timeout = await setTimeout(() => {
      const next = characters.shift()
      next.span.classList.add("revealed")
      this.revealOneCharacter(characters)

    }, this.speed)
  }

  warpToDone() {
    clearTimeout(this.timeout)
    this.isDone = true
    this.element.querySelectorAll("span").forEach(s => s.classList.add("revealed"))
  }


  init() {
    const characters = []
    this.text.split('').forEach(character => {

      const span = document.createElement('span')
      span.textContent = character
      this.element.appendChild(span)

      characters.push({ span, speed: this.speed })
    })

    this.revealOneCharacter(characters)

  }
}