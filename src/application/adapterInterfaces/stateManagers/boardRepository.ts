import { BOARD_MOVES_TYPES } from "../../constants"

export type State = {
    mainNumbers: MainNumbers
    selectedCell: Cell
    notes: Notes
    moves: unknown[]
}

export type CellMainNumber = {
    cell: Cell
    number: MainNumberValue
}

export type ToggleNotes = {
    cell: Cell
    note: NoteValue
}[]

export type Move = {
    selectedCell: Cell,
    mainNumber: {
        action: BOARD_MOVES_TYPES,
        value: number,
    } | {},
    notes: {
        action: BOARD_MOVES_TYPES,
        bunch: ToggleNotes
    } | {}
}

export interface BoardRepository {
    setState: (state: State) => void;
    setSelectedCell: (cell: Cell) => void;
    setCellMainNumber: (cellMainNumber: CellMainNumber) => void;
    setNotesBunch: (notesBunch: ToggleNotes) => void;
    eraseNotesBunch: (notesBunch: ToggleNotes) => void;
    addMove: (move: Move) => void;
    popMove: () => void;
    getMainNumbers: () => MainNumbers;
    getMoves: () => Move[];
    getNotes: () => Notes;
    getSelectedCell: () => Cell;
}
