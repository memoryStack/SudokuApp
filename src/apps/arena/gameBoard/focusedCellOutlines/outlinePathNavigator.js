import _forEach from 'lodash/src/utils/forEach'
import _map from 'lodash/src/utils/map'
import _cloneDeep from 'lodash/src/utils/cloneDeep'

import { areSameCells, isCellExists } from "../../utils/util"
import { BOARD_GRID_BORDERS_DIRECTION } from "../../constants"
import {
    getVerticalBorderWidthBetweenCells,
    getHorizontalBorderWidthBetweenCells,
    getBordersWidthBetweenCells
} from "./borderUtils"

const firstBottomBorder = (strokeWidth, cellSize, cellPositionInSVGContainer) => {
    const startX = cellPositionInSVGContainer.x - strokeWidth
    const startY = cellPositionInSVGContainer.y + cellSize.height + strokeWidth / 2
    return [
        'M', startX, startY,
        'l', strokeWidth + cellSize.width, 0
    ]
}

const closingPath = (strokeWidth) => {
    return ['l', 0, strokeWidth]
}

const bottomToBottom = ({ previousCell, currentCell, cellSize }) => {
    const borderInBetween = getVerticalBorderWidthBetweenCells(previousCell, currentCell)
    return ['l', borderInBetween + cellSize.width, 0]
}

const bottomToRight = ({ strokeWidth, cellSize }) => {
    return [
        'l', strokeWidth / 2, 0,
        'l', 0, -(cellSize.height + strokeWidth / 2)
    ]
}

const bottomToLeft = ({ strokeWidth, previousCell, currentCell, cellSize }) => {
    const {
        [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: horizontalBorder,
        [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: verticalBorder,
    } = getBordersWidthBetweenCells(previousCell, currentCell)

    return [
        'l', verticalBorder - strokeWidth / 2, 0,
        'l', 0, (cellSize.width + horizontalBorder - strokeWidth / 2)
    ]
}

const leftToLeft = ({ previousCell, currentCell, cellSize }) => {
    const borderInBetween = getHorizontalBorderWidthBetweenCells(previousCell, currentCell)
    return ['l', 0, borderInBetween + cellSize.height]
}

const leftToTop = ({ strokeWidth, previousCell, currentCell, cellSize }) => {
    const {
        [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: horizontalBorder,
        [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: verticalBorder,
    } = getBordersWidthBetweenCells(previousCell, currentCell)

    return [
        'l', 0, horizontalBorder - strokeWidth / 2,
        'l', -(cellSize.width + verticalBorder - strokeWidth / 2), 0
    ]
}

const leftToBottom = ({ strokeWidth, cellSize }) => {
    return [
        'l', 0, strokeWidth / 2,
        'l', strokeWidth / 2 + cellSize.width, 0
    ]
}

const topToTop = ({ previousCell, currentCell, cellSize }) => {
    const borderInBetween = getVerticalBorderWidthBetweenCells(previousCell, currentCell)
    return [
        'l', -(borderInBetween + cellSize.width), 0
    ]
}

const topToRight = ({ strokeWidth, previousCell, currentCell, cellSize }) => {
    const {
        [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: horizontalBorder,
        [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: verticalBorder,
    } = getBordersWidthBetweenCells(previousCell, currentCell)
    return [
        'l', -(verticalBorder - strokeWidth / 2), 0,
        'l', 0, -(cellSize.height + horizontalBorder - strokeWidth / 2)
    ]
}

const topToLeft = ({ strokeWidth, cellSize }) => {
    return [
        'l', -strokeWidth / 2, 0,
        'l', 0, cellSize.height + strokeWidth / 2
    ]
}

const rightToRight = ({ previousCell, currentCell, cellSize }) => {
    const borderInBetween = getHorizontalBorderWidthBetweenCells(previousCell, currentCell)
    return [
        'l', 0, -(borderInBetween + cellSize.height)
    ]
}

const rightToTop = ({ strokeWidth, cellSize }) => {
    return [
        'l', 0, -strokeWidth / 2,
        'l', -(cellSize.width + strokeWidth / 2), 0
    ]
}

const rightToBottom = ({ strokeWidth, previousCell, currentCell, cellSize }) => {
    const {
        [BOARD_GRID_BORDERS_DIRECTION.HORIZONTAL]: horizontalBorder,
        [BOARD_GRID_BORDERS_DIRECTION.VERTICAL]: verticalBorder,
    } = getBordersWidthBetweenCells(previousCell, currentCell)

    return [
        'l', 0, -(horizontalBorder - strokeWidth / 2),
        'l', (cellSize.width + verticalBorder - strokeWidth / 2), 0
    ]
}

export const CELL_BORDER_TYPES = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
}

const PREVIOUS_TO_NEXT_BORDER_PATH_RESOLVER = {
    [CELL_BORDER_TYPES.TOP]: {
        [CELL_BORDER_TYPES.TOP]: topToTop,
        [CELL_BORDER_TYPES.RIGHT]: topToRight,
        [CELL_BORDER_TYPES.LEFT]: topToLeft,
    },
    [CELL_BORDER_TYPES.RIGHT]: {
        [CELL_BORDER_TYPES.TOP]: rightToTop,
        [CELL_BORDER_TYPES.RIGHT]: rightToRight,
        [CELL_BORDER_TYPES.BOTTOM]: rightToBottom,
    },
    [CELL_BORDER_TYPES.BOTTOM]: {
        [CELL_BORDER_TYPES.RIGHT]: bottomToRight,
        [CELL_BORDER_TYPES.BOTTOM]: bottomToBottom,
        [CELL_BORDER_TYPES.LEFT]: bottomToLeft,
    },
    [CELL_BORDER_TYPES.LEFT]: {
        [CELL_BORDER_TYPES.TOP]: leftToTop,
        [CELL_BORDER_TYPES.BOTTOM]: leftToBottom,
        [CELL_BORDER_TYPES.LEFT]: leftToLeft,
    },
}

export const getStartCellInGroup = (cellsGroup) => {
    return cellsGroup.sort((cellA, cellB) => {
        if (cellA.row === cellB.row) return cellA.col - cellB.col
        if (cellA.col === cellB.col) return -(cellA.row - cellB.row)
        return -(cellA.row - cellB.row)
    })[0]
}

// TODO: handle errors here
export const getFocusedCellsOutline = (cellSetsToFocus, strokeWidth, cellsRef, boardRef) => {
    // segregate cells in their groups // dropped the plan of disjoint-sets due to various reasons
    // const cellsDisjointSets = getCellsDisjointSets(cellSetsToFocus)

    return new Promise((resolve) => {
        // resolve when data is generated for all groups

        // TODO: use null check here
        boardRef.current.measure((_x, _y, _boardWidth, _boardHeight, boardPageX, boardPageY) => {
            const pathPromises = _map(cellSetsToFocus, (_cellsSet) => {
                const cellsSet = _cloneDeep(_cellsSet)
                return new Promise((resolve) => {
                    const startCell = getStartCellInGroup(cellsSet)
                    // TODO: use null check here
                    cellsRef[startCell.row][startCell.col].current.measure((_x, _y, cellWidth, cellHeight, startCellPageX, startCellPageY) => {
                        const cellPositionInSVGContainer = {
                            x: strokeWidth + (startCellPageX - boardPageX),
                            y: strokeWidth + (startCellPageY - boardPageY),
                        }
                        const cellSize = { width: cellWidth, height: cellHeight }

                        const outlinePath = getCellOutline(cellsSet, strokeWidth, cellSize, cellPositionInSVGContainer)
                        resolve(outlinePath)
                    })
                })
            })

            Promise.all(pathPromises).then((paths) => {
                resolve({ paths, boardXPos: boardPageX, boardYPos: boardPageY })
            })
        })
    })
}

export const getCellOutline = (cellsGroup, strokeWidth, cellSize, cellPositionInSVGContainer) => {
    const startCell = getStartCellInGroup(cellsGroup)

    const result = firstBottomBorder(strokeWidth, cellSize, cellPositionInSVGContainer)

    let previousBorder = CELL_BORDER_TYPES.BOTTOM
    let previousCell = startCell

    while (true) {

        if (shouldStopOutline(startCell, previousBorder, previousCell, cellsGroup)) {
            result.push(...closingPath(strokeWidth))
            break
        }

        const { nextCell, nextBorder } = getNextCellAndBorderToPaint(previousBorder, previousCell, cellsGroup)

        const pathHandler = PREVIOUS_TO_NEXT_BORDER_PATH_RESOLVER[previousBorder][nextBorder]

        result.push(...pathHandler({
            previousCell,
            currentCell: nextCell,
            cellSize,
            strokeWidth,
        }))
        previousBorder = nextBorder
        previousCell = nextCell
    }

    return result.join(' ')
}

const shouldStopOutline = (startCell, previousBorder, previousCell, cellsInGroup) => {
    const {
        nextCell, nextBorder
    } = getNextCellAndBorderToPaint(previousBorder, previousCell, cellsInGroup)
    return areSameCells(startCell, nextCell) && nextBorder === CELL_BORDER_TYPES.BOTTOM
}

export const getNextCellAndBorderToPaint = (previousBorder, previousCell, cellsInGroup) => {
    if (previousBorder === CELL_BORDER_TYPES.TOP) {
        let nextCell = { row: previousCell.row - 1, col: previousCell.col - 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.RIGHT }

        nextCell = { row: previousCell.row, col: previousCell.col - 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.TOP }

        return { nextCell: previousCell, nextBorder: CELL_BORDER_TYPES.LEFT }
    }

    if (previousBorder === CELL_BORDER_TYPES.RIGHT) {
        let nextCell = { row: previousCell.row - 1, col: previousCell.col + 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.BOTTOM }

        nextCell = { row: previousCell.row - 1, col: previousCell.col }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.RIGHT }

        return { nextCell: previousCell, nextBorder: CELL_BORDER_TYPES.TOP }
    }

    if (previousBorder === CELL_BORDER_TYPES.BOTTOM) {
        let nextCell = { row: previousCell.row + 1, col: previousCell.col + 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.LEFT }

        nextCell = { row: previousCell.row, col: previousCell.col + 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.BOTTOM }

        return { nextCell: previousCell, nextBorder: CELL_BORDER_TYPES.RIGHT }
    }

    if (previousBorder === CELL_BORDER_TYPES.LEFT) {
        let nextCell = { row: previousCell.row + 1, col: previousCell.col - 1 }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.TOP }

        nextCell = { row: previousCell.row + 1, col: previousCell.col }
        if (isCellExists(nextCell, cellsInGroup)) return { nextCell, nextBorder: CELL_BORDER_TYPES.LEFT }

        return { nextCell: previousCell, nextBorder: CELL_BORDER_TYPES.BOTTOM }
    }
}
