import { Overworld } from "overworld";
import {
  asGridCoords,
  DirectionsEnum,
  linePath,
  squarePath,
  withGrid,
} from "../utils";
import { ConfigObjectType, EventType, Map, MapsEnum } from "./interfaces";

export const DemoRoom: Map = {
  overworld: {} as Overworld,
  id: MapsEnum.DEMO_ROOM,
  lowerSrc: "./images/maps/DemoLower.png",
  upperSrc: "./images/maps/DemoUpper.png",
  gameObjects: {},
  configObjects: {
    hero: {
      type: ConfigObjectType.PERSON,
      x: withGrid(5),
      y: withGrid(5),
      isPlayerControlled: true,
    },
    npc1: {
      type: ConfigObjectType.PERSON,
      x: withGrid(7),
      y: withGrid(9),
      src: "./images/characters/people/npc1.png",
      behaviorLoop: [
        { type: EventType.STAND, direction: DirectionsEnum.DOWN, time: 800 },
        { type: EventType.STAND, direction: DirectionsEnum.UP, time: 800 },
        { type: EventType.STAND, direction: DirectionsEnum.LEFT, time: 1200 },
        { type: EventType.STAND, direction: DirectionsEnum.DOWN, time: 300 },
      ],
      talking: [
        {
          required: ["TALKED_WITH_ERIO"],
          events: [
            {
              type: EventType.TEXT_MESSAGE,
              text: "MACHISTA!",
              faceHero: "npc1",
            },
          ],
        },
        {
          events: [
            { type: EventType.TEXT_MESSAGE, text: "Hello!", faceHero: "npc1" },
            { type: EventType.TEXT_MESSAGE, text: "HELLOOOOOO!" },
            { type: EventType.BATTLE, enemyId: "beth" },
            { type: EventType.ADD_STORY_FLAG, flag: "DEFEATED_BETH" },
            { type: EventType.TEXT_MESSAGE, text: "You won... THIS TIME!" },
          ],
        },
      ],
    },
    npcA: {
      type: ConfigObjectType.PERSON,
      x: withGrid(8),
      y: withGrid(5),
      src: "./images/characters/people/erio.png",
      talking: [
        {
          events: [
            {
              type: EventType.TEXT_MESSAGE,
              text: "HELLOOOOOO!",
              faceHero: "npcA",
            },
            { type: EventType.ADD_STORY_FLAG, flag: "TALKED_WITH_ERIO" },
          ],
        },
      ],
    },
    pizzaStone: {
      type: ConfigObjectType.PIZZA_STONE,
      x: withGrid(2),
      y: withGrid(7),
      storyFlag: "USED_PIZZA_STONE",
      pizzas: ["v001", "f001"],
    },
    npc3: {
      type: ConfigObjectType.PERSON,
      x: withGrid(5),
      y: withGrid(6),
      src: "./images/characters/people/npc5.png",
      behaviorLoop: [
        { type: EventType.WALK, direction: DirectionsEnum.RIGHT },
        { type: EventType.WALK, direction: DirectionsEnum.DOWN },
        { type: EventType.WALK, direction: DirectionsEnum.DOWN },
        { type: EventType.WALK, direction: DirectionsEnum.LEFT },
        { type: EventType.WALK, direction: DirectionsEnum.LEFT },
        { type: EventType.WALK, direction: DirectionsEnum.UP },
        { type: EventType.WALK, direction: DirectionsEnum.UP },
        { type: EventType.WALK, direction: DirectionsEnum.RIGHT },
        { type: EventType.STAND, direction: DirectionsEnum.UP, time: 800 },
      ],
      talking: [
        {
          required: ["TALKED_WITH_ERIO"],
          events: [
            {
              type: EventType.TEXT_MESSAGE,
              text: "MACHISTA!",
              faceHero: "npc1",
            },
          ],
        },
        {
          events: [
            { type: EventType.TEXT_MESSAGE, text: "Hello!", faceHero: "npc1" },
            { type: EventType.TEXT_MESSAGE, text: "HELLOOOOOO!" },
            { type: EventType.BATTLE, enemyId: "beth" },
            { type: EventType.ADD_STORY_FLAG, flag: "DEFEATED_BETH" },
            { type: EventType.TEXT_MESSAGE, text: "You won... THIS TIME!" },
          ],
        },
      ],
    },
  },
  walls: {
    // Table
    ...squarePath([7, 6], [8, 7]),

    // Bookshelf
    ...linePath([3, 4], [4, 4]),

    // Wall
    ...linePath([1, 3], [10, 3]),
    ...linePath([0, 4], [0, 9]),
    ...linePath([11, 4], [11, 9]),
    ...linePath([1, 10], [4, 10]),
    ...linePath([6, 10], [10, 10]),
    [asGridCoords(5, 11)]: true,
    [asGridCoords(6, 4)]: true,
    [asGridCoords(8, 4)]: true,
  },
  cutsceneSpaces: {
    [asGridCoords(7, 4)]: [
      {
        events: [
          { who: "npcA", type: EventType.WALK, direction: DirectionsEnum.LEFT },
          { who: "npcA", type: EventType.STAND, direction: DirectionsEnum.UP },
          {
            who: "npcA",
            type: EventType.TEXT_MESSAGE,
            text: "YOU CAN'T AFFORD THIS PLACE!",
          },
          {
            who: "npcA",
            type: EventType.WALK,
            direction: DirectionsEnum.RIGHT,
          },
          {
            who: "npcA",
            type: EventType.STAND,
            direction: DirectionsEnum.DOWN,
          },
          { who: "hero", type: EventType.WALK, direction: DirectionsEnum.DOWN },
        ],
      },
    ],
    [asGridCoords(5, 10)]: [
      {
        events: [
          {
            type: EventType.CHANGE_MAP,
            map: MapsEnum.KITCHEN,
            x: withGrid(2),
            y: withGrid(2),
            direction: DirectionsEnum.DOWN,
          },
        ],
      },
    ],
  },
};
