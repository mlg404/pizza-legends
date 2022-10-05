import { Overworld } from "../overworld";
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

export interface Event {
  type: EventType;
  direction?: DirectionsEnum;
  time?: number;
  text?: string;
  faceHero?: string;
  enemyId?: string;
  flag?: string;
  map?: MapsEnum;
  x?: number;
  y?: number;
  who?: string;
}

export interface StandEvent extends Event {
  direction: DirectionsEnum;
}

export interface WalkEvent extends Event {
  who: string;
  direction: DirectionsEnum;
}

export interface BattleEvent extends Event {
  enemyId: string;
}

export interface ChangeMapEvent extends Event {
  map: MapsEnum;
  x: number;
  y: number;
  direction: DirectionsEnum;
}

export interface Talking {
  required?: string[];
  events: Event[];
}

export interface CutsceneSpaceEvents {
  events: Event[];
}

export interface ConfigObject {
  type: ConfigObjectType;
  x: number;
  y: number;
  direction?: DirectionsEnum;
  isPlayerControlled?: boolean;
  src?: string;
  behaviorLoop?: Event[];
  talking?: Talking[];
  storyFlag?: string;
  pizzas?: string[];
  isMouted?: boolean;
}

export interface Map {
  id: string;
  lowerSrc?: string;
  upperSrc?: string;
  gameObjects: Record<string, ConfigObject>;
  configObjects?: Record<string, ConfigObject>;
  walls?: Record<string, boolean>;
  cutsceneSpaces?: Record<string, CutsceneSpaceEvents[]>;
  overworld: Overworld;
}
