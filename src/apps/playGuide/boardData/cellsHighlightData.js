import _isEmpty from '@lodash/isEmpty'
import _get from '@lodash/get'

import { BoardIterators } from '@domain/board/utils/boardIterators'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { HOUSE_TYPE } from '../../arena/utils/smartHints/constants'
import { setCellDataInHintResult } from '../../arena/utils/smartHints/util'

export const HOUSES_COLORS = {
    CELL_BG: {
        [HOUSE_TYPE.ROW]: '#d5baff',
        [HOUSE_TYPE.COL]: '#aac7ff',
        [HOUSE_TYPE.BLOCK]: '#6cd9c1',
    },
    HOUSE_TEXT: {
        [HOUSE_TYPE.ROW]: '#845EC2',
        [HOUSE_TYPE.COL]: '#2C73D2',
        [HOUSE_TYPE.BLOCK]: '#008F7A',
    },
}

const addHouseCellsHighlightData = (house, cellsHighlightData) => {
    getHouseCells(house).forEach(cell => {
        const cellHighlightData = {
            bgColor: { backgroundColor: HOUSES_COLORS.CELL_BG[house.type] },
        }
        setCellDataInHintResult(cell, cellHighlightData, cellsHighlightData)
    })
}

const addRemainingCellsHighlightData = cellsHighlightData => {
    BoardIterators.forBoardEachCell(cell => {
        if (_isEmpty(_get(cellsHighlightData, [cell.row, cell.col]))) {
            const cellHighlightData = { bgColor: { backgroundColor: 'white' } }
            setCellDataInHintResult(cell, cellHighlightData, cellsHighlightData)
        }
    })
}

const cellsHighlightData = {}

addHouseCellsHighlightData({ type: HOUSE_TYPE.ROW, num: 3 }, cellsHighlightData)
addHouseCellsHighlightData({ type: HOUSE_TYPE.COL, num: 6 }, cellsHighlightData)
addHouseCellsHighlightData({ type: HOUSE_TYPE.BLOCK, num: 6 }, cellsHighlightData)
addRemainingCellsHighlightData(cellsHighlightData)

export { cellsHighlightData }
