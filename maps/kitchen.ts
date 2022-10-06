import { Overworld } from "overworld";
import { asGridCoords, DirectionsEnum, withGrid } from "../utils";
import { ConfigObjectType, EventType, Map, MapsEnum } from "./interfaces";

export const Kitchen: Map = {
  id: MapsEnum.KITCHEN,
  lowerSrc: "./images/maps/KitchenLower.png",
  upperSrc: "./images/maps/KitchenUpper.png",
  configObjects: {
    hero: {
      type: ConfigObjectType.PERSON,
      isPlayerControlled: true,
      x: withGrid(5),
      y: withGrid(5),
    },
    npcA: {
      type: ConfigObjectType.PERSON,
      x: withGrid(9),
      y: withGrid(6),
      src: "./images/characters/people/npc2.png",
    },
    npcB: {
      type: ConfigObjectType.PERSON,
      x: withGrid(10),
      y: withGrid(8),
      src: "./images/characters/people/npc3.png",
    },
  },
  cutsceneSpaces: {
    [asGridCoords(5, 10)]: [
      {
        events: [
          {
            type: EventType.CHANGE_MAP,
            map: MapsEnum.STREET,
            x: withGrid(29),
            y: withGrid(9),
            direction: DirectionsEnum.DOWN,
          },
        ],
      },
    ],
  },
  walls: {},
  gameObjects: {},
  overworld: {} as Overworld,
};
