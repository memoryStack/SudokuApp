import {
    getMainNumbers, getMoves, getNotesInfo, getSelectedCell,
} from '../../apps/arena/store/selectors/board.selectors'
import { boardActions } from '../../apps/arena/store/reducers/board.reducers'

import { getStoreState, invokeDispatch } from '../../redux/dispatch.helpers'

import type {
    BoardRepository as BoardRepositoryInterface,
    State,
    CellMainNumber,
    ToggleNotes,
    Move,
} from '@application/adapterInterfaces/stateManagers/boardRepository'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'

type StateReaders = {
    getMainNumbers: () => State['mainNumbers']
    getMoves: () => State['moves']
    getNotesInfo: () => State['notes']
    getSelectedCell: () => State['selectedCell']
}

export const createBoardRepositoryHandlers = (boardActions, stateReaders: StateReaders): BoardRepositoryInterface => {
    const {
        setState,
        setSelectedCell,
        setCellMainNumber,
        setNotesBunch,
        eraseNotesBunch,
        addMove,
        popMove,
    } = boardActions

    const {
        getMainNumbers, getMoves, getNotesInfo, getSelectedCell,
    } = stateReaders

    return {
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
        getMainNumbers: () => getMainNumbers(getStoreState()),
        getMoves: () => getMoves(getStoreState()),
        getNotes: () => getNotesInfo(getStoreState()),
        getSelectedCell: () => getSelectedCell(getStoreState()),
        getPuzzleString: () => {
            const mainNumbers = getMainNumbers(getStoreState())
            let result = ''
            BoardIterators.forBoardEachCell((cell) => {
                const cellValue = MainNumbersRecord.getCellMainValue(mainNumbers, cell)
                result += cellValue
            })
            return result
        }
    }
}

export const BoardRepository = createBoardRepositoryHandlers(boardActions, {
    getMainNumbers, getMoves, getNotesInfo, getSelectedCell,
})
