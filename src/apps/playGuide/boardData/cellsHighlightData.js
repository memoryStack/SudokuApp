import _isEmpty from 'lodash/src/utils/isEmpty'
import _get from 'lodash/src/utils/get'

import { getHouseCells } from '../../arena/utils/houseCells'
import { HOUSE_TYPE } from '../../arena/utils/smartHints/constants'
import { setCellDataInHintResult } from '../../arena/utils/smartHints/util'
import { forBoardEachCell } from '../../arena/utils/util'

export const HOUSE_VS_CELLS_BACKGROUND_COLOR = {
    [HOUSE_TYPE.ROW]: 'rgba(255, 0, 0, 0.6)',
    [HOUSE_TYPE.COL]: 'rgba(0, 255, 0, 0.6)',
    [HOUSE_TYPE.BLOCK]: 'rgba(0, 0, 255, 0.6)',
}

const addHouseCellsHighlightData = (house, cellsHighlightData) => {
    getHouseCells(house).forEach(cell => {
        const cellHighlightData = {
            bgColor: { backgroundColor: HOUSE_VS_CELLS_BACKGROUND_COLOR[house.type] },
        }
        // TODO: below function name could be a little generic
        setCellDataInHintResult(cell, cellHighlightData, cellsHighlightData)
    })
}

const addRemainingCellsHighlightData = cellsHighlightData => {
    forBoardEachCell(cell => {
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
addRemainingCellsHighlightData(cellsHighlightData) // TODO: this step shouldn't be here

export { cellsHighlightData }