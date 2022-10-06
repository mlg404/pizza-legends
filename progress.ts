import { playerState } from "state/playerState";
import { DirectionsEnum } from "utils";

export class Progress {
  public mapId: string;
  public startingHeroX: number;
  public startingHeroY: number;
  public startingHeroDirection: DirectionsEnum;
  public saveFileKey: string;

  constructor() {
    this.mapId = "DemoRoom";
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = DirectionsEnum.DOWN;
    this.saveFileKey = "PizzaLegends_SaveFile1";
  }

  save(hero) {
    window.localStorage.setItem(
      this.saveFileKey,
      JSON.stringify({
        mapId: this.mapId,
        startingHeroX: hero.x,
        startingHeroY: hero.y,
        startingHeroDirection: hero.direction,
        playerState: {
          pizzas: playerState.pizzas,
          lineup: playerState.lineup,
          storyFlags: playerState.storyFlags,
          items: playerState.items,
        },
      })
    );
  }

  getSaveFile() {
    const file = window.localStorage.getItem(this.saveFileKey);

    return file ? JSON.parse(file) : null;
  }

  load() {
    const file = this.getSaveFile();

    if (!file) return;

    this.mapId = file.mapId;
    this.startingHeroX = file.startingHeroX;
    this.startingHeroY = file.startingHeroY;
    this.startingHeroDirection = file.startingHeroDirection;
    Object.keys(file.playerState).forEach(
      (key) => (playerState[key] = file.playerState[key])
    );
  }
}
