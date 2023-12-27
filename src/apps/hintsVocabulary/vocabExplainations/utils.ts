import _cloneDeep from '@lodash/cloneDeep'

import { BoardIterators } from 'src/apps/arena/utils/classes/boardIterators'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { isCellExists } from 'src/apps/arena/utils/util'

export const getLinkHTMLText = (href: HINTS_VOCAB_IDS, text: string) => `<a href="${href}">${text}</a>`

type BoardData = {
    mainNumbers: MainNumbers,
    notes: Notes
}
export const getTrimmedBoardData = (boardData:BoardData, focusedCells: Cell[]): BoardData => {
    const mainNumbers = _cloneDeep(boardData.mainNumbers)
    const notes = _cloneDeep(boardData.notes)
    BoardIterators.forBoardEachCell((cell: Cell) => {
        if (!isCellExists(cell, focusedCells)) {
            mainNumbers[cell.row][cell.col].value = 0
            notes[cell.row][cell.col] = []
        }
    })

    return { mainNumbers, notes }
}
