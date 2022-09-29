const utils = {
  withGrid(n) {
    return n * 16
  },
  asGridCoords(x, y) {
    return [x * 16, y * 16].join(',')
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX
    let y = initialY
    const size = 16

    const moves = {
      "left": [x - size, y],
      "right": [x + size, y],
      "up": [x, y - size],
      "down": [x, y + size]
    }

    return moves[direction]
  },

  linePath(start, end) {
    const [startX, startY] = start
    const [endX, endY] = end
    const xDiff = endX - startX
    const yDiff = endY - startY
    const length = Math.max(xDiff, yDiff) + 1
    const isVertical = xDiff > 0

    const elements = isVertical ? Array.from({ length }) : Array.from({ length })

    const lineCoords = {}

    elements.forEach((_, i) => {
      lineCoords[utils.asGridCoords(
        isVertical ? startX + i : startX,
        isVertical ? startY : startY + i
      )] = true
    })

    return lineCoords
  },

  squarePath(start, end) {
    const [startX, startY] = start
    const [endX, endY] = end
    const xDiff = endX - startX
    const yDiff = endY - startY

    const elementsX = Array.from({ length: xDiff + 1 })
    const elementsY = Array.from({ length: yDiff + 1 })

    const squareCoords = {}

    elementsX.forEach((_, ix) => {
      elementsY.forEach((_, iy) => {
        squareCoords[utils.asGridCoords(startX + ix, startY + iy)] = true
      })
    })

    return squareCoords
  },

  emitEvent(name, detail) {
    const event = new CustomEvent(name, { detail })
    document.dispatchEvent(event)
  },

}
