// this interface is defined by domain
import { ClickableCells, RemovableNotesInfo } from '../apps/arena/utils/smartHints/types'

type ToggleNotes = {
    cell: Cell
    notes: NoteValue[]
}[]

export type NumberInputData = {
    inputNumber: number
    removableNotes: ToggleNotes
}

export type NumberEraseData = ToggleNotes

export type HintData = {
    hints: unknown[] // TODO: come back to this type later
    mainNumbers: MainNumbers
    notes: Notes
}

export interface SmartHintRepository {
    removeHints: () => void
    setHints: (data: HintData) => void
    getHintStepNumber: () => number
    setHintStepNumber: (stepNum: number) => void
    setTryOutSelectedCell: (cell: Cell) => void
    updateBoardDataOnTryOutNumberInput: (data: NumberInputData) => void
    updateBoardDataOnTryOutErase: (data: NumberEraseData) => void
    getTryOutMainNumbers: () => MainNumbers
    getTryOutClickableCells: () => ClickableCells
    getRemovableNotes: () => RemovableNotesInfo
    getTryOutSelectedCell: () => Cell
    getTryOutNotes: () => Notes
    getTryOutCellsRestrictedNumberInputs: () => unknown
    getTryOutCellsRestrictedNumberInputsMsg: () => string
    getUnclickableCellClickInTryOutMsg: () => string
}
