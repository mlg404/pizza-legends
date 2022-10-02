class TurnCycle {
  constructor({ battle, onNewEvent }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
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


    this.currentTeam = utils.oppositeTeam(this.currentTeam)
    this.turn()
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: "The battle begins!"
    })

    this.turn()
  }
}