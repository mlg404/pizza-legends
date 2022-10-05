import { DirectionsEnum } from "../utils";

export enum MapsEnum {
  DEMO_ROOM = "DemoRoom",
  KITCHEN = "Kitchen",
  STREET = "Street",
}

export enum ConfigObjectType {
  PERSON = "Person",
  PIZZA_STONE = "PizzaStone",
}

export enum EventType {
  TEXT_MESSAGE = "textMessage",
  BATTLE = "battle",
  ADD_STORY_FLAG = "addStoryFlag",
  WALK = "walk",
  STAND = "stand",
  CHANGE_MAP = "changeMap",
}

interface Event {
  type: EventType;
  direction?: DirectionsEnum;
  time?: number;
  text?: string;
  faceHero?: string;
  enemyId?: string;
  flag?: string;
}

interface Talking {
  required?: string[];
  events: Event[];
}

interface CutsceneEvent {
  who?: string;
  type: EventType;
  direction?: DirectionsEnum;
  text?: string;
  map?: MapsEnum;
  x?: number;
  y?: number;
}

interface CutsceneSpaceEvents {
  events: CutsceneEvent[];
}

interface ConfigObject {
  type: ConfigObjectType;
  x: number;
  y: number;
  isPlayerControlled?: boolean;
  src?: string;
  behaviorLoop?: Event[];
  talking?: Talking[];
  storyFlag?: string;
  pizzas?: string[];
}

export interface Map {
  id: string;
  lowerSrc?: string;
  upperSrc?: string;
  gameObjects?: {};
  configObjects?: Record<string, ConfigObject>;
  walls?: Record<string, boolean>;
  cutsceneSpaces?: Record<string, CutsceneSpaceEvents[]>;
}
