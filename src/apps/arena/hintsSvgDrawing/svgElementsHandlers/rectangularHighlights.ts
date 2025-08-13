import { Path, Rect, Svg } from 'react-native-svg'
import { View } from 'react-native'

import { roundToNearestPixel } from "@utils/util"
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from "../../constants"
import { getBlockStartCell } from "../../utils/util"

const linkColor = 'rgba(50, 20, 24, 1)'

export enum ELEMENTS_TYPES {
    CELL = 'cell',
    BLOCK = 'block',
    BAND = 'band',
    LINE = 'line',
    ROW = 'row',
    COLUMN = 'column',
}

export enum BAND_DIRECTIONS {
    HORIZONTAL = 'h',
    VERTICAL = 'v'
}

type ElementConfigs = {
    type: ELEMENTS_TYPES
    band?: {
        num: number, // index of the band
        direction: BAND_DIRECTIONS,
    }
    num?: number
    cell?: Cell,
    strokes?: any, // to customize the color etc etc
}

const strokeProps = {
    stroke: linkColor,
    strokeWidth: roundToNearestPixel(1.75),
    strokeLinejoin: 'round',
}

const STROKE_WIDTH = roundToNearestPixel(10)

const svgBoardSizeDiff = 40

const getBordersCountBeforeCell = (cell) => {
    return {
        horizontal: {
            thin: cell.col - Math.floor(cell.col / 3),
            thick: Math.floor(cell.col / 3),
        },
        vertical: {
            thin: cell.row - Math.floor(cell.row / 3),
            thick: Math.floor(cell.row / 3),
        }
    }
}

const getCellCordinates = (cell) => {
    const dimension = { w: 80, h: 80 }
    const { horizontal, vertical } = getBordersCountBeforeCell(cell)
    return {
        x: cell.col * dimension.w + horizontal.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + horizontal.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        y: cell.row * dimension.h + vertical.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + vertical.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        dimension
    }
}

const getRowCordinates = (num) => {
    const firstCell = { row: num, col: 0 }
    const dimension = { w: 744, h: 80 }
    const firstCellCords = getCellCordinates(firstCell)

    return {
        x: firstCellCords.x,
        y: firstCellCords.y,
        dimension
    }
}

const getColumnCordinates = (num) => {
    const firstCell = { row: 0, col: num }
    const dimension = { w: 80, h: 744 }
    const firstCellCords = getCellCordinates(firstCell)

    return {
        x: firstCellCords.x,
        y: firstCellCords.y,
        dimension
    }
}

const getBlockCordinates = (num: number) => {
    const startCell = getBlockStartCell(num)
    const { horizontal, vertical } = getBordersCountBeforeCell(startCell)
    const dimension = { w: 244, h: 244 }
    const cellDimensions = { w: 80, h: 80 }
    return {
        x: startCell.col * cellDimensions.w + horizontal.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + horizontal.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        y: startCell.row * cellDimensions.h + vertical.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + vertical.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        dimension
    }
}

const getBandCordinates = ({ num, direction }: ElementConfigs['band']) => {
    const startCell = {
        row: direction === 'h' ? num * 3 : 0,
        col: direction === 'h' ? 0 : num * 3,
    }

    const dimension = {
        w: direction === 'h' ? 744 : 244,
        h: direction === 'h' ? 244 : 744,
    }

    const { horizontal, vertical } = getBordersCountBeforeCell(startCell)
    const cellDimensions = { w: 80, h: 80 }
    return {
        x: startCell.col * cellDimensions.w + horizontal.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + horizontal.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        y: startCell.row * cellDimensions.h + vertical.thin * STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH + vertical.thick * STATIC_BOARD_ELEMENTS_DIMENSIONS.THICK_BORDER_WIDTH,
        dimension
    }

}

const getCellCenter = (cell: Cell) => {
    const cellCord = getCellCordinates(cell)
    return {
        x: cellCord.x + cellCord.dimension.w / 2 + svgBoardSizeDiff / 2,
        y: cellCord.y + cellCord.dimension.h / 2 + svgBoardSizeDiff / 2,
    }
}

const getLineElementConfigs = ({ start, end }: { start: Cell, end: Cell }) => {
    const startCellCenter = getCellCenter(start)
    const endCellCenter = getCellCenter(end)

    const linePath = [
        'M', startCellCenter.x, startCellCenter.y,
        'L', endCellCenter.x, endCellCenter.y,
    ].join(' ')

    return {
        element: Path,
        props: {
            d: linePath,
            ...strokeProps,
        },
    }
}

const getPathsToEncircleElement = (element: ElementConfigs) => {
    let cellCord
    switch (element.type) {
        case 'cell':
            cellCord = getCellCordinates(element.cell)
            break
        case 'block':
            cellCord = getBlockCordinates(element.num)
            break
        case 'band':
            cellCord = getBandCordinates(element.band)
            break
        case 'line':
            return getLineElementConfigs(element.line)
        case 'row':
            cellCord = getRowCordinates(element.num)
            break
        case 'column':
            cellCord = getColumnCordinates(element.num)
    }

    const RECT_CORD = {
        x: cellCord.x - (STROKE_WIDTH / 2) + svgBoardSizeDiff / 2 + STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
        y: cellCord.y - (STROKE_WIDTH / 2) + svgBoardSizeDiff / 2 + STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH,
    }

    return {
        element: Rect,
        props: {
            x: RECT_CORD.x,
            y: RECT_CORD.y,
            width: cellCord.dimension.w + STROKE_WIDTH,
            height: cellCord.dimension.h + STROKE_WIDTH,
            ...{
                stroke: linkColor,
                strokeWidth: STROKE_WIDTH,
                strokeLinejoin: 'round',
                ...element.strokes
            },
        }
    }
}

export const getRectangularHighlightsPaths = (elementsConfigs: ElementConfigs[]) => {
    return elementsConfigs.map((config) => {
        return getPathsToEncircleElement(config)
    })
}

// examples below
// const xx = [
//     getPathsToEncircleACell({ type: 'cell', cell: { row: 4, col: 4 } }),
//     getPathsToEncircleACell({ type: 'band', band: { num: 1, direction: 'v' } }),
//     getPathsToEncircleACell({ type: 'band', band: { num: 1, direction: 'h' } }),
// ]
