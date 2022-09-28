import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_ACTION_TYPES } from '../gameBoard/actionTypes'
import {
    areSameCells,
    duplicatesInPuzzle,
    forBoardEachCell,
    isDuplicateEntry,
    getRowAndCol,
    getBlockAndBoxNum,
    initMainNumbers,
    isCellEmpty,
    convertBoardCellNumToCell,
} from '../utils/util'
import { getPuzzleSolutionType } from '../utils/util'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../constants/events'
import { PUZZLE_SOLUTION_TYPES } from '../constants'

const initBoardData = () => {
    const mainNumbers = initMainNumbers()

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
    const str = '906070403000400200070003010500000100040208060003000005030700050007005000405010708'

    if (__DEV__) {
        for (let i = 0; i < str.length; i++) {
            const { row, col } = convertBoardCellNumToCell(i)
            mainNumbers[row][col].value = parseInt(str[i], 10)
            mainNumbers[row][col].isClue = true
        }
    }

    const notesInfo = new Array(9)
    for (let i = 0; i < 9; i++) {
        const rowNotes = []
        for (let j = 0; j < 9; j++) {
            const boxNotes = new Array(9)
            for (let k = 1; k <= 9; k++) boxNotes[k - 1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }

    return {
        notesInfo,
        mainNumbers,
        selectedCell: { row: 0, col: 0 },
    }
}

let INITIAL_STATE = {}
const resetInitialState = () => {
    const { mainNumbers, notesInfo, selectedCell } = initBoardData()
    INITIAL_STATE.mainNumbers = mainNumbers
    INITIAL_STATE.notesInfo = notesInfo
    INITIAL_STATE.selectedCell = selectedCell
}
resetInitialState()

const handleInit = ({ setState }) => {
    setState({ ...initBoardData() })
}

const handleInputNumberClick = ({ setState, getState, params: newInputValue }) => {
    const { selectedCell, mainNumbers } = getState()

    const { row, col } = selectedCell

    if (newInputValue === mainNumbers[row][col].value) return

    const oldInputValue = mainNumbers[row][col].value
    mainNumbers[row][col].value = newInputValue
    mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, selectedCell, newInputValue)

    if (oldInputValue && oldInputValue !== newInputValue) {
        updateWronglyPlacedNumbersStatusInHouses(oldInputValue, selectedCell, mainNumbers)
    }

    setState({ mainNumbers: [...mainNumbers] })

    if (!mainNumbers[row][col].wronglyPlaced) {
        setTimeout(() => {
            let nextCol = col + 1
            let nextRow = row
            if (nextCol === 9) {
                nextCol = 0
                nextRow++
            }
            if (nextRow !== 9) setState({ selectedCell: { row: nextRow, col: nextCol } })
        }, 0)
    }
}

const updateWronglyPlacedNumbersStatusInHouses = (oldInputValue, cell, mainNumbers) => {
    const { row, col } = cell

    for (let col = 0; col < 9; col++) {
        if (isCellEligibleForStatusUpdate(row, col))
            mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(
                mainNumbers,
                { row, col },
                mainNumbers[row][col].value,
            )
    }
    for (let row = 0; row < 9; row++) {
        if (isCellEligibleForStatusUpdate(row, col))
            mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(
                mainNumbers,
                { row, col },
                mainNumbers[row][col].value,
            )
    }
    const { blockNum } = getBlockAndBoxNum(cell)
    for (let box = 0; box < 9; box++) {
        const { row, col } = getRowAndCol(blockNum, box)
        if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === oldInputValue)
            mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(
                mainNumbers,
                { row, col },
                mainNumbers[row][col].value,
            )
    }

    function isCellEligibleForStatusUpdate(row, col) {
        return mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === oldInputValue
    }
}

const handleEraseClick = ({ setState, getState }) => {
    const { selectedCell, mainNumbers } = getState()
    mainNumbers[selectedCell.row][selectedCell.col].value = 0
    setState({ mainNumbers: [...mainNumbers] })
}

const handleCellClick = ({ setState, getState, params: cell }) => {
    const { selectedCell } = getState()
    if (areSameCells(selectedCell, cell)) return
    setState({ selectedCell: cell })
}

const getCluesCount = mainNumbers => {
    let cluesCount = 0
    forBoardEachCell(({ row, col }) => {
        if (mainNumbers[row][col].value) cluesCount++
    })
    return cluesCount
}

const handleOnClose = ({ params: ref }) => {
    if (!ref) return
    ref.current && ref.current.closeDragger()
    resetInitialState()
}

const showSnackBar = ({ msg }) => {
    emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
        msg,
        visibleTime: 5000,
    })
}

const handlePlay = ({ setState, getState, params: { ref: customPuzzleHCRef } }) => {
    const { mainNumbers, startCustomPuzzle } = getState()

    if (getCluesCount(mainNumbers) < 18) {
        showSnackBar({ msg: 'clues are less than 18' })
        return
    }

    const duplicateNumber = duplicatesInPuzzle(mainNumbers)
    if (duplicateNumber.present) {
        const { cell } = duplicateNumber
        setState({ selectedCell: cell })
        showSnackBar({ msg: `puzzle has multiple instances of ${mainNumbers[cell.row][cell.col].value} in same house` })
        return
    }

    const hasMultipleSolutions = getPuzzleSolutionType(mainNumbers) === PUZZLE_SOLUTION_TYPES.MULTIPLE_SOLUTIONS
    console.log('@@@@@@ mainNumbers after puzzle', JSON.stringify(mainNumbers))
    if (hasMultipleSolutions) {
        showSnackBar({ msg: 'puzzle has multiple valid solutions. please input valid puzzle' })
    } else {
        transformMainNumbersForValidPuzzle(mainNumbers)
        startCustomPuzzle(mainNumbers)
        handleOnClose({ params: customPuzzleHCRef })
    }
}

const transformMainNumbersForValidPuzzle = mainNumbers => {
    forBoardEachCell(({ row, col }) => {
        mainNumbers[row][col].isClue = !isCellEmpty({ row, col }, mainNumbers)
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

export { INITIAL_STATE, ACTION_TYPES, ACTION_HANDLERS }
