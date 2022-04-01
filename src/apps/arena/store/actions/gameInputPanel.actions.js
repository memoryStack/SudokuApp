import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { EVENTS, PENCIL_STATE } from '../../../../resources/constants'
import { emit } from '../../../../utils/GlobalEventBus'
import { consoleLog, getBlockAndBoxNum } from '../../../../utils/util'
import { getHouseCells } from '../../utils/houseCells'
import { getSmartHint } from '../../utils/smartHint'
import { HOUSE_TYPE, NO_HINTS_FOUND_POPUP_TEXT } from '../../utils/smartHints/constants'
import { duplicacyPresent } from '../../utils/util'
import { eraseNotesBunch } from '../reducers/board.reducers'
import { getMainNumbers, getNotesInfo, getSelectedCell } from '../selectors/board.selectors'
import { getPencilStatus } from '../selectors/boardController.selectors'
import { addCellNote, removeCellNote, removeCellNotes, removeMainNumber, updateCellMainNumber } from './board.actions'
import { addMistake } from './refree.actions'

// TODO: tranfrom it for movesData
// TODO: add the removed notes in cells other than currentCell to the undo move
//          right now we are just recording the current cells notes only
const removeNotesAfterCellFilled = (number, cell) => {
    const notesInfo = getNotesInfo(getStoreState())
    const { row, col } = cell
    let notesErasedByMainValue = []
    
    const bunch = []
    for (let note = 0; note < 9; note++) {
        const { show } = notesInfo[row][col][note]
        if (show) {
            notesErasedByMainValue.push(note + 1)
            bunch.push({ cell, note: note + 1 })
        }
    }

    const houses = [
        {
            type: HOUSE_TYPE.ROW,
            num: row,
        },
        {
            type: HOUSE_TYPE.COL,
            num: col,
        },
        {
            type: HOUSE_TYPE.BLOCK,
            num:  getBlockAndBoxNum(cell).blockNum,
        },
    ]

    houses.forEach(({ type, num }) => {
        getHouseCells(type, num).forEach(({ row, col }) => {
            const { show } = notesInfo[row][col][number - 1]
            if (show) {
                bunch.push({ cell: { row, col }, note: number })
            }
        })
    })

    invokeDispatch(eraseNotesBunch(bunch))

    return notesErasedByMainValue
}

// TODO: break this func and accomodate it to append moves
export const inputNumberAction = (number) => {    
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    if (mainNumbers[selectedCell.row][selectedCell.col].value) return

    const pencilState = getPencilStatus(getStoreState())
    if (pencilState === PENCIL_STATE.ACTIVE) {
        if (duplicacyPresent(number, mainNumbers, selectedCell )) return
        const notesInfo = getNotesInfo(getStoreState())
        const { show } = notesInfo[selectedCell.row][selectedCell.col][number - 1]
        if (show) removeCellNote(selectedCell, number)
        else addCellNote(selectedCell, number)
    } else {
        updateCellMainNumber(selectedCell, number)
        removeNotesAfterCellFilled( number, selectedCell)
        if (number !== mainNumbers[selectedCell.row][selectedCell.col].value) addMistake()
        // TODO: if all the cells are filled then change game state
    }
}

// mutate it for supporting moves tracking
export const eraseAction = () => {
    const selectedCell = getSelectedCell(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())    
    if (mainNumbers[selectedCell.row][selectedCell.col].value && !mainNumbers[selectedCell.row][selectedCell.col].isClue) {
        removeMainNumber(selectedCell)
    } else if (!mainNumbers[selectedCell.row][selectedCell.col].value) {
        removeCellNotes(selectedCell)
    }
}
