import _cloneDeep from '@lodash/cloneDeep'

import { BoardIterators } from '@domain/board/utils/boardIterators'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { isCellExists } from 'src/apps/arena/utils/util'

export const getLinkHTMLText = (href: HINTS_VOCAB_IDS, text: string) => `<a href="${href}">${text}</a>`

type BoardData = {
    mainNumbers: MainNumbers,
    notes: Notes
}

type TrimConfig = {
    trimMainNumbers?: boolean,
    trimNotes?: boolean
}

const DEFAULT_TRIM_CONFIGS = {
    trimMainNumbers: true,
    trimNotes: true,
}

export const getTrimmedBoardData = (
    boardData: BoardData,
    focusedCells: Cell[],
    configs: TrimConfig = DEFAULT_TRIM_CONFIGS,
): BoardData => {
    const mainNumbers = _cloneDeep(boardData.mainNumbers)
    const notes = _cloneDeep(boardData.notes)
    BoardIterators.forBoardEachCell((cell: Cell) => {
        if (!isCellExists(cell, focusedCells)) {
            if (configs.trimMainNumbers) mainNumbers[cell.row][cell.col].value = 0
            if (configs.trimNotes) notes[cell.row][cell.col] = []
        }
    })
    return { mainNumbers, notes }
}
