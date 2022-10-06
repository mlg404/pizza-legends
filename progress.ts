import { MapsEnum } from "maps/interfaces";
import { Person } from "person";
import { PlayerState, playerState } from "state/playerState";
import { DirectionsEnum } from "utils";

interface SavedFile {
  mapId: MapsEnum;
  startingHeroX: number;
  startingHeroY: number;
  startingHeroDirection: DirectionsEnum;
  playerState: PlayerState;
}
export class Progress {
  public mapId: MapsEnum;
  public startingHeroX: number;
  public startingHeroY: number;
  public startingHeroDirection: DirectionsEnum;
  public saveFileKey: string;

  constructor() {
    this.mapId = MapsEnum.DEMO_ROOM;
    this.startingHeroX = 0;
    this.startingHeroY = 0;
    this.startingHeroDirection = DirectionsEnum.DOWN;
    this.saveFileKey = "PizzaLegends_SaveFile1";
  }

  save(hero: Person) {
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

  getSaveFile(): SavedFile {
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
    playerState.pizzas = file.playerState.pizzas;
    playerState.lineup = file.playerState.lineup;
    playerState.storyFlags = file.playerState.storyFlags;
    playerState.items = file.playerState.items;
  }
}
