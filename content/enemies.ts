export interface Pizza {
  pizzaId: string;
  maxHp?: number;
  level?: number;
  hp?: number;
  xp?: number;
  maxXp?: number;
  status?: null;
}
export interface Enemy {
  name: string;
  src: string;
  pizzas: Record<string, Pizza>;
}
export const Enemies: Record<string, Enemy> = {
  erio: {
    name: "Erio",
    src: "./images/characters/people/erio.png",
    pizzas: {
      a: {
        pizzaId: "s001",
        maxHp: 50,
        level: 1,
      },
      b: {
        pizzaId: "s002",
        maxHp: 50,
        level: 1,
      },
    },
  },
  beth: {
    name: "Beth",
    src: "./images/characters/people/npc1.png",
    pizzas: {
      a: {
        pizzaId: "f001",
        hp: 1,
        maxHp: 50,
        level: 1,
      },
    },
  },
};
