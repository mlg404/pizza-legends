import { Overworld } from "overworld";
import { asGridCoords, DirectionsEnum, withGrid } from "../utils";
import { ConfigObjectType, EventType, Map, MapsEnum } from "./interfaces";

export const Street: Map = {
  id: MapsEnum.STREET,
  lowerSrc: "./images/maps/StreetLower.png",
  upperSrc: "./images/maps/StreetUpper.png",
  configObjects: {
    hero: {
      type: ConfigObjectType.PERSON,
      x: withGrid(30),
      y: withGrid(10),
      isPlayerControlled: true,
    },
  },
  cutsceneSpaces: {
    [asGridCoords(29, 9)]: [
      {
        events: [
          {
            type: EventType.CHANGE_MAP,
            map: MapsEnum.KITCHEN,
            x: withGrid(5),
            y: withGrid(10),
            direction: DirectionsEnum.UP,
          },
        ],
      },
    ],
  },
  walls: {},
  gameObjects: {},
  overworld: {} as Overworld,
};
