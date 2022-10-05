export const withGrid = (n: number) => {
  return n * 16;
};

export const asGridCoords = (x: number, y: number): string => {
  return [x * 16, y * 16].join(",");
};

export enum DirectionsEnum {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
}

export const nextPosition = (
  initialX: number,
  initialY: number,
  direction: DirectionsEnum
) => {
  const size = 16;

  const moves: { [key in DirectionsEnum]: [number, number] } = {
    left: [initialX - size, initialY],
    right: [initialX + size, initialY],
    up: [initialX, initialY - size],
    down: [initialX, initialY + size],
  };

  return moves[direction];
};

export const linePath = (start: [number, number], end: [number, number]) => {
  const [startX, startY] = start;
  const [endX, endY] = end;
  const xDiff = endX - startX;
  const yDiff = endY - startY;
  const length = Math.max(xDiff, yDiff) + 1;
  const isVertical = xDiff > 0;

  const elements = isVertical ? Array.from({ length }) : Array.from({ length });

  const lineCoords = {};

  elements.forEach((_, i) => {
    lineCoords[
      asGridCoords(
        isVertical ? startX + i : startX,
        isVertical ? startY : startY + i
      )
    ] = true;
  });

  return lineCoords;
};

export const squarePath = (start: [number, number], end: [number, number]) => {
  const [startX, startY] = start;
  const [endX, endY] = end;
  const xDiff = endX - startX;
  const yDiff = endY - startY;

  const elementsX = Array.from({ length: xDiff + 1 });
  const elementsY = Array.from({ length: yDiff + 1 });

  const squareCoords = {};

  elementsX.forEach((_, ix) => {
    elementsY.forEach((_, iy) => {
      squareCoords[asGridCoords(startX + ix, startY + iy)] = true;
    });
  });

  return squareCoords;
};

export const emitEvent = (name: string, detail) => {
  const event = new CustomEvent(name, { detail });
  document.dispatchEvent(event);
};

export const oppositeDirection = (
  direction: DirectionsEnum
): DirectionsEnum => {
  const opposite = {
    [DirectionsEnum.LEFT]: DirectionsEnum.RIGHT,
    [DirectionsEnum.RIGHT]: DirectionsEnum.LEFT,
    [DirectionsEnum.UP]: DirectionsEnum.DOWN,
    [DirectionsEnum.DOWN]: DirectionsEnum.UP,
  };

  return opposite[direction];
};

export enum TeamEnum {
  PLAYER = "player",
  ENEMY = "enemy",
}

export const oppositeTeam = (team: TeamEnum): TeamEnum => {
  const opposite = {
    [TeamEnum.PLAYER]: TeamEnum.ENEMY,
    [TeamEnum.ENEMY]: TeamEnum.PLAYER,
  };

  return opposite[team];
};

export const wait = (ms: number): Promise<number> => {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
};

export const randomFromArray = (array: unknown[]) => {
  return array[Math.floor(Math.random() * array.length)];
};
