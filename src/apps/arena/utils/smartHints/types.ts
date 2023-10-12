interface NotesToHighlightData {
    [note: string]: {
      fontColor: string
    }
}

type CellBackgroundColor = {
    backgroundColor: string
}

interface CellHighlightData {
    bgColor: CellBackgroundColor
    notesToHighlightData: NotesToHighlightData
}

interface RowData {
    [columnIndex: string]: CellHighlightData
}

export interface CellsFocusData {
    [rowIndex: string]: RowData;
}

type ChainCell = {
    cell: Cell
    in?: NoteValue
    out?: NoteValue
}

export type Chain = ChainCell[]

export type FocusedCells = Cell[]
export type SelectCellOnClose = Cell
export type ClickableCells = Cell[]

export type HintStep = {
    text: string
    isTryOut?:boolean
}

export type HintSteps = HintStep[]

type NotesRemovalHintAction = {
    cell: Cell
    action: {
        type: string
        notes: NoteValue[]
    }
}

type AddMainNumberHintAction = {
    cell: Cell
    action: {
        type: string
        mainNumber: MainNumberValue
    }
}

export type ApplyHint = AddMainNumberHintAction[] | NotesRemovalHintAction[]

// TODO: put here vaild values of state instead of string
export type TryOutResult = {
    state: string
    msg: string
}
