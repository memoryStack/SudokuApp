import { useSelector } from 'react-redux'

import { getTryOutSelectedCell, getTryOutMainNumbers, getTryOutNotes } from '../store/selectors/smartHintHC.selectors'
import {
    getMainNumbers, getNotesInfo, getPossibleNotes, getSelectedCell,
} from '../store/selectors/board.selectors'

import { useIsHintTryOutStep } from '../utils/smartHints/hooks'

export const useGameBoardInputs = () => {
    const isHintTryOut = useIsHintTryOutStep()
    const selectedCellSelector = isHintTryOut ? getTryOutSelectedCell : getSelectedCell
    const mainNumbersSelector = isHintTryOut ? getTryOutMainNumbers : getMainNumbers
    const notesSelector = isHintTryOut ? getTryOutNotes : getNotesInfo

    const selectedCell = useSelector(selectedCellSelector)
    const mainNumbers = useSelector(mainNumbersSelector)
    const notes = useSelector(notesSelector)
    const possibleNotes = useSelector(getPossibleNotes)

    return {
        selectedCell,
        mainNumbers,
        notes,
        possibleNotes,
    }
}
