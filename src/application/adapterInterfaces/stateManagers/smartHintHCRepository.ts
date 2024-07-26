type ToggleNotes = {
    cell: Cell
    notes: NoteValue[]
}[]

export type NumberEraseData = ToggleNotes

export type NumberInputData = {
    inputNumber: number
    removableNotes: ToggleNotes
}

export interface SmartHintRepository {
    getTryOutSelectedCell: () => Cell | undefined
    getTryOutCellsRestrictedNumberInputsMsg: () => string
    getTryOutNotes: () => Notes | null
    getTryOutMainNumbers: () => MainNumbers | null
    getTryOutCellsRestrictedNumberInputs: () => unknown // TODO: add interface for this unknown type here
    updateBoardDataOnTryOutNumberInput: (data: NumberInputData) => void
    updateBoardDataOnTryOutErase: (data: NumberEraseData) => void
}
