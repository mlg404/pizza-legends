window.Actions = {
  damage1: {
    name: "Whomp!",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: 100 },
    ]
  },
  saucyStatus: {
    name: "Tomato Squeeze",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "stateChange", status: { type: 'saucy', expiresIn: 3 } },
      // { type: "animation", animation: "spin" },
    ]
  },
  clumsyStatus: {
    name: "Olive Oil",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: 'clumsy', expiresIn: 3 } },
      { type: "textMessage", text: "{TARGET} is splipping all around" },
    ]
  },

  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling fresh and warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
      { type: "stateChange", status: null },
      { type: "textMessage", text: "Feeling Fresh!!" },
    ]
  },
  item_recoverHp: {
    name: "Parmesan",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} sprinkles on some {ACTION}" },
      { type: "stateChange", recover: 10 },
      { type: "textMessage", text: "{CASTER} recovers HP" },
    ]
  }

}