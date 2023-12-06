import { boardActions } from '../../apps/arena/store/reducers/board.reducers'

import { invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    BoardRepository as BoardRepositoryInterface,
    State,
    CellMainNumber,
    ToggleNotes,
    Move,
} from '../../interfaces/boardRepository'

const {
    setState,
    setSelectedCell,
    setCellMainNumber,
    setNotesBunch,
    eraseNotesBunch,
    addMove,
    popMove,
} = boardActions

export const BoardRepository: BoardRepositoryInterface = {
    setState: (state: State) => {
        invokeDispatch(setState(state))
    },
    setSelectedCell: (cell: Cell) => {
        invokeDispatch(setSelectedCell(cell))
    },
    setCellMainNumber: (cellMainNumber: CellMainNumber) => {
        invokeDispatch(setCellMainNumber(cellMainNumber))
    },
    setNotesBunch: (notesBunch: ToggleNotes) => {
        invokeDispatch(setNotesBunch(notesBunch))
    },
    eraseNotesBunch: (notesBunch: ToggleNotes) => {
        invokeDispatch(eraseNotesBunch(notesBunch))
    },
    addMove: (move: Move) => {
        invokeDispatch(addMove(move))
    },
    popMove: () => {
        invokeDispatch(popMove())
    },
}
