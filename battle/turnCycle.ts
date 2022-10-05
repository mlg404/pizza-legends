class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = "player";
  }

  async turn() {
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId]

    const enemyId = this.battle.activeCombatants[utils.oppositeTeam(this.currentTeam)];
    const enemy = this.battle.combatants[enemyId]

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy
    })

    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get 'em ${submission.replacement.name}!`
      })

      this.nextTurn()

      return
    }

    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;
      this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target
      }
      await this.onNewEvent(event)
    }

    const targetDead = submission.target.hp <= 0
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.target.name} has been defeated!`
      })
    }

    if (targetDead && submission.target.team === "enemy") {
      const playerActivePizzaId = this.battle.activeCombatants.player
      const xp = submission.target.givesXp
      const combatant = this.battle.combatants[playerActivePizzaId]

      await this.onNewEvent({
        type: "textMessage",
        text: `${combatant.name} gained ${xp} experience!`
      })

      await this.onNewEvent({
        type: "giveXp",
        xp,
        combatant
      })
    }

    const winner = this.getWinningTeam()
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: `Winner`
      })
      this.onWinner(winner)
      return

    }

    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team
      })

      await this.onNewEvent({
        type: "replace",
        replacement
      })
      await this.onNewEvent({
        type: "textMessage",
        text: `${replacement.name} shows up!`
      })
      // await this.onNewEvent({
      //   type: "textMessage",
      //   text: `${submission.target.name} has been defeated!`
      // })
    }


    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        caster,
        target: submission.target,
        submission,
        action: submission.action
      }
      await this.onNewEvent(event)
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent)
    }


    this.nextTurn()
  }

  nextTurn() {
    this.currentTeam = utils.oppositeTeam(this.currentTeam)
    this.turn()
  }

  getWinningTeam() {
    let aliveTeam = {};
    Object.values(this.battle.combatants).forEach(combatant => {
      if (combatant.hp > 0) {
        aliveTeam[combatant.team] = true;
      }
    })

    if (!aliveTeam.enemy) return "player"
    if (!aliveTeam.player) return "enemy"

    return null;
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "The battle begins!"
    })

    this.turn()
  }
}