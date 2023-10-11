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

type FocusedCells = Cell[]
type SelectCellOnClose = Cell
type clickableCells = Cell[]

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

type ApplyHint = AddMainNumberHintAction[] | NotesRemovalHintAction[]
