class SubmissionMenu {
  constructor({ caster, enemy, onComplete }) {
    this.caster = caster;
    this.onComplete = onComplete;
    this.enemy = enemy;
  }

  getPages() {

    const backOption = {
      label: "go back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root)
      }
    }


    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack to use",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().attacks)
          }
        },
        {
          label: "Items",
          description: "Choose an item",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().items)
          }
        },
        {
          label: "Swap",
          description: "Change to another pizza",
          disabled: true,
          handler: () => { }
        }
      ],
      attacks: [
        ...this.caster.actions.map(key => {
          const action = Actions[key]
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action)
            }
          }
        }),
        backOption
      ],
      items: [
        {
          label: "item",
          description: "item iii",
          handler: () => { }
        },
        backOption
      ],
    }
  }

  menuSubmit(action, instanceId = null) {

    this.keyboardMenu?.end()

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy
    })
  }

  decide() {
    this.menuSubmit(Actions[this.caster.actions[0]])
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu()
    this.keyboardMenu.init(container)
    this.keyboardMenu.setOptions(this.getPages().root)
  }

  init(container) {
    if (!this.caster.isPlayerControlled) return this.decide()

    this.showMenu(container)
  }
}