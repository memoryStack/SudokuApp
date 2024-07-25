import { getCloseDraggerHandler } from '../../components/BottomDragger'
import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_ACTION_TYPES } from '../gameBoard/actionTypes'
import {
    areSameCells,
    duplicatesInPuzzle,
    areMultipleMainNumbersInAnyHouseOfCell,
    getPuzzleSolutionType,
} from '../utils/util'

import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../constants/events'
import { PUZZLE_SOLUTION_TYPES } from '../constants'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { blockCellToBoardCell, getBlockAndBoxNum, convertBoardCellNumToCell } from '@domain/board/utils/cellsTransformers'
import { CELLS_IN_A_HOUSE } from '@domain/board/board.constants'
import { Board } from '@domain/board/board'

const initBoardData = () => {
    const mainNumbers = MainNumbersRecord.initMainNumbers()

    // this string have naked groups present
    // const str = '615030700000790010040005030000523090520000008400068000306080970200479006974356281'

    // have hidden group (may be double)
    // const str = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'

    // have hidden tripple
    // const str = '000000260009080043500030090000215000350000109180379004800054900004000000005023410'

    // have x-wing
    // const str = '600095007540007100002800050800000090000078000030000008050002300304500020920030504'

    // have finned x-wing
    // const str = '754008030836000000192350840245900000000745000900003654029810000000000910010500008'

    // const str = '300012598001080763080700241700001380403870010108200075519308027030190850804520139'

    // used as a test-case for hints validity checkers
    // const str = '300006002086420009402310006007900520000250107524037000093001240001000003000800670'

    // have x-wing with no notes to remove
    // const str = '090008170000670002100590400904280001080016050761904080005009000049100025000000849'

    // have XY or Y or V Wing
    // const str = '800360900009010863063089005924673158386951724571824396432196587698537000000248639'

    // omissions
    // const str = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'

    // try-out analyser helper funcs
    // const str = '400000107305800406080406320043050070000000940801003002004530708500070204018004030'

    // finned x-wing bug
    // const str = '040059000259000308001000250430805610805006432600430000503000170020010003076003000'

    // puzzle with duplicate solutions
    // const str = '906070403000400200070003010500000100040208060003000005030700050007005000405010708'

    // bug in x-wing analyser
    // const str = '000800069000006312060010070100240005007500108005038040020000950001600703056000080'

    // unicorn case for hidden tripple. TODO: analyze it properly
    // const str = '085000291736000485291405736007503000000100840012000000004008009070290004020004600'

    // puzzle returned by Fast Sudoku Puzzle dependency
    // const str = '900008000000004027061027000095000004080010090600000780000850140850600000000300002'

    // remote pairs
    // const str = '080023400620409508410085020040906082068542000290038654154267893872394165936851247'

    // it has remote pairs which doesn't make any cycle at all, links cross each other
    // const str = '360859004519472386408613950146738295900541000005926401054387009093164500001295043'

    // example that a lot of notes can be removed, not only in cell which is common to end points.
    // it also shows that we can apply this technique even when we have odd number of cells in our chain
    // https://hodoku.sourceforge.net/en/show_example.php?file=rp02&tech=Remote+Pair
    // const str = '178609050934150607256703010793560041641037590825914736567301000410075060380406175'

    // first symmetric puzzle
    // const str = '800963005000002800000001900700136000036040780000789036008300500307500610500618007'
    // const str = '090000070800000000576390800900014005004070900700930014003089657000060403050020180'
    // const str = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'
    // const str = '000000260009080043500030090000215000350000109180379004800054900004000000005023410'
    const str = ''
    if (__DEV__) {
        for (let i = 0; i < str.length; i++) {
            const { row, col } = convertBoardCellNumToCell(i)
            mainNumbers[row][col].value = parseInt(str[i], 10)
            mainNumbers[row][col].isClue = true
        }
    }

    return {
        notes: NotesRecord.initNotes(),
        mainNumbers,
        selectedCell: { row: 0, col: 0 },
    }
}

export const getInitialState = () => initBoardData()

const handleInit = ({ setState }) => {
    setState({ ...initBoardData() })
}

const handleInputNumberClick = ({ setState, getState, params: newInputValue }) => {
    const { selectedCell, mainNumbers } = getState()
    const { row, col } = selectedCell
    if (MainNumbersRecord.isCellFilledWithNumber(mainNumbers, newInputValue, selectedCell)) return

    const oldInputValue = MainNumbersRecord.getCellMainValue(mainNumbers, { row, col })
    mainNumbers[row][col].value = newInputValue
    mainNumbers[row][col].wronglyPlaced = areMultipleMainNumbersInAnyHouseOfCell(mainNumbers, selectedCell, newInputValue)

    if (oldInputValue && oldInputValue !== newInputValue) {
        updateWronglyPlacedNumbersStatusInHouses(oldInputValue, selectedCell, mainNumbers)
    }

    setState({ mainNumbers: [...mainNumbers] })

    if (!mainNumbers[row][col].wronglyPlaced) {
        setTimeout(() => {
            let nextCol = col + 1
            let nextRow = row
            if (nextCol === CELLS_IN_A_HOUSE) {
                nextCol = 0
                nextRow++
            }
            if (nextRow !== CELLS_IN_A_HOUSE) setState({ selectedCell: { row: nextRow, col: nextCol } })
        }, 0)
    }
}

const updateWronglyPlacedNumbersStatusInHouses = (oldInputValue, cell, mainNumbers) => {
    for (let col = 0; col < CELLS_IN_A_HOUSE; col++) {
        if (isCellEligibleForStatusUpdate(cell.row, col)) {
            mainNumbers[cell.row][col].wronglyPlaced = areMultipleMainNumbersInAnyHouseOfCell(
                mainNumbers,
                { row: cell.row, col },
                MainNumbersRecord.getCellMainValue(mainNumbers, { row: cell.row, col }), // TODO: this argument is redundant
            )
        }
    }
    for (let row = 0; row < CELLS_IN_A_HOUSE; row++) {
        if (isCellEligibleForStatusUpdate(row, cell.col)) {
            mainNumbers[row][cell.col].wronglyPlaced = areMultipleMainNumbersInAnyHouseOfCell(
                mainNumbers,
                { row, col: cell.col },
                MainNumbersRecord.getCellMainValue(mainNumbers, { row, col: cell.col }), // TODO: this argument is redundant
            )
        }
    }
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let box = 0; box < CELLS_IN_A_HOUSE; box++) {
        const { row, col } = blockCellToBoardCell({ blockNum, boxNum: box })
        if (mainNumbers[row][col].wronglyPlaced && MainNumbersRecord.isCellFilledWithNumber(mainNumbers, oldInputValue, { row, col })) {
            mainNumbers[row][col].wronglyPlaced = areMultipleMainNumbersInAnyHouseOfCell(
                mainNumbers,
                { row, col },
                MainNumbersRecord.getCellMainValue(mainNumbers, { row, col }), // TODO: this argument is redundant
            )
        }
    }

    function isCellEligibleForStatusUpdate(row, col) {
        return mainNumbers[row][col].wronglyPlaced && MainNumbersRecord.isCellFilledWithNumber(mainNumbers, oldInputValue, { row, col })
    }
}

const handleEraseClick = ({ setState, getState }) => {
    const { selectedCell, mainNumbers } = getState()
    const cellInputValue = mainNumbers[selectedCell.row][selectedCell.col].value
    mainNumbers[selectedCell.row][selectedCell.col].value = 0
    updateWronglyPlacedNumbersStatusInHouses(cellInputValue, selectedCell, mainNumbers)
    setState({ mainNumbers: [...mainNumbers] })
}

const handleCellClick = ({ setState, getState, params: cell }) => {
    const { selectedCell } = getState()
    if (areSameCells(selectedCell, cell)) return
    setState({ selectedCell: cell })
}

const handleOnClose = ({ params: ref }) => {
    const closeDragger = getCloseDraggerHandler(ref)
    closeDragger()
}

const showSnackBar = ({ msg }) => {
    emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
        msg,
        visibleTime: 5000,
    })
}

const handlePlay = async ({ setState, getState, params: { ref: customPuzzleHCRef } }) => {
    const { mainNumbers, startCustomPuzzle } = getState()

    if (Board.getCluesCount(mainNumbers) < 18) {
        showSnackBar({ msg: 'clues are less than 18' })
        return
    }

    const duplicateNumber = duplicatesInPuzzle(mainNumbers)
    if (duplicateNumber.present) {
        const { cell } = duplicateNumber
        setState({ selectedCell: cell })
        showSnackBar({ msg: `puzzle has multiple instances of ${MainNumbersRecord.getCellMainValue(mainNumbers, cell)} in same house` })
        return
    }

    const hasMultipleSolutions = await getPuzzleSolutionType(mainNumbers) === PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS

    if (hasMultipleSolutions) {
        showSnackBar({ msg: 'puzzle has multiple valid solutions. please input valid puzzle' })
    } else {
        transformMainNumbersForValidPuzzle(mainNumbers)
        startCustomPuzzle(mainNumbers)
        handleOnClose({ params: customPuzzleHCRef })
    }
}

const transformMainNumbersForValidPuzzle = mainNumbers => {
    BoardIterators.forBoardEachCell(({ row, col }) => {
        mainNumbers[row][col].isClue = MainNumbersRecord.isCellFilled(mainNumbers, { row, col })
        delete mainNumbers[row][col].wronglyPlaced
    })
}

const ACTION_TYPES = {
    ...BOARD_ACTION_TYPES,
    ...INPUT_PANEL_ACTION_TYPES,
    ON_INIT: 'ON_INIT',
    ON_CLOSE: 'ON_CLOSE',
    ON_PLAY: 'ON_PLAY',
}

// in-consistency in the action_type names
const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_INIT]: handleInit,
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellClick,
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleInputNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraseClick,
    [ACTION_TYPES.ON_CLOSE]: handleOnClose,
    [ACTION_TYPES.ON_PLAY]: handlePlay,
}

export { ACTION_TYPES, ACTION_HANDLERS }
