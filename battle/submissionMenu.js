class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.onComplete = onComplete;
    this.enemy = enemy;
    this.replacements = replacements;

    let quantityMap = {}
    items.forEach(item => {
      if (item.team !== caster.team) return

      quantityMap[item.actionId] = {
        actionId: item.actionId,
        quantity: quantityMap[item.actionId]?.quantity + 1 || 1,
        instanceId: item.instanceId
      }

    })

    this.items = Object.values(quantityMap)
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
          disabled: false,
          handler: () => this.keyboardMenu.setOptions(this.getPages().replacements)
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
        ...this.items.map(item => {
          const action = Actions[item.actionId]
          return {
            label: action.name,
            description: action.description,
            right: () => `x${item.quantity}`,
            handler: () => this.menuSubmit(action, item.instanceId)
          }
        }),
        backOption
      ],
      replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            // right: () => `x${replacement.quantity}`,
            handler: () =>
              this.menuSubmitReplacement(replacement)

          }
        }),
        backOption
      ],
    }
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end()
    this.onComplete({ replacement })
  }

  menuSubmit(action, instanceId = null) {

    this.keyboardMenu?.end()

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId
    })
  }

  decide() {
    const randomMove = utils.randomFromArray(this.caster.actions)
    this.menuSubmit(Actions[randomMove])
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