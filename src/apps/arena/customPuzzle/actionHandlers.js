import { ACTION_TYPES as INPUT_PANEL_ACTION_TYPES } from '../inputPanel/constants'
import { ACTION_TYPES as BOARD_ACTION_TYPES } from '../gameBoard/actionTypes'
import { initMainNumbers, getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { areSameCells, duplicatesInPuzzle, isDuplicateEntry } from '../utils/util'
import { getNumberOfSolutions } from '../utils/util'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../constants/events'

const initBoardData = () => {
    const mainNumbers = initMainNumbers()

    // this string have naked groups present
    // const str = '615030700000790010040005030000523090520000008400068000306080970200479006974356281'

    // have hidden group (may be double)
    // const str = '400372196002000870970000400503001760090037504207000300600003907009700240720950600'

    // have hidden tripple
    // const str = '000000260009080043500030090000215000350000109180379004800054900004000000005023410'

    // have x-wing
    const str = '600095007540007100002800050800000090000078000030000008050002300304500020920030504'

    // have x-wing with no notes to remove
    // const str = '090008170000670002100590400904280001080016050761904080005009000049100025000000849'

    // have XY or Y or V Wing
    // const str = '800360900009010863063089005924673158386951724571824396432196587698537000000248639'

    // omissions
    // const str = '400005608370806490008402370940257006200000900086900000000009060039001020800720500'

    if (__DEV__) {
        for (let i = 0; i < str.length; i++) {
            const row = Math.floor(i / 9)
            const col = i % 9
            if (str[i]) {
                mainNumbers[row][col].value = parseInt(str[i], 10)
                mainNumbers[row][col].isClue = 1
            }
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
    setState({ ...initBoardData(), validPuzzleFilled: false })
}

const handleInputNumberClick = ({ setState, getState, params: number }) => {
    const { selectedCell, mainNumbers } = getState()

    const { row, col } = selectedCell
    const initialValue = mainNumbers[row][col].value
    mainNumbers[row][col].value = number
    mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, selectedCell, number)

    if (initialValue && initialValue !== number) {
        // reset "wronglyPlaced" flag for the values which might be
        // converted from wronglyPlaced to correctly placed due to input in this cell
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, { row, col }, initialValue)
        }
        for (let row = 0; row < 9; row++) {
            if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, { row, col }, initialValue)
        }
        const { blockNum } = getBlockAndBoxNum(selectedCell)
        for (let box = 0; box < 9; box++) {
            const { row, col } = getRowAndCol(blockNum, box)
            if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, { row, col }, initialValue)
        }
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
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (mainNumbers[row][col].value) cluesCount++
        }
    }
    return cluesCount
}

const handleOnClose = ({ params: ref }) => {
    if (!ref) return
    ref.current && ref.current.closeDragger()
    resetInitialState()
}

const showSnackBar = ({ snackBarRenderer, msg }) => {
    emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
        snackbarView: snackBarRenderer(msg),
        visibleTime: 5000,
    })
}

const handlePlay = ({ setState, getState, params: { snackBarRenderer, ref: customPuzzleHCRef } }) => {
    const { mainNumbers, startCustomPuzzle } = getState()

    if (getCluesCount(mainNumbers) < 18) {
        showSnackBar({ msg: 'clues are less than 18', snackBarRenderer })
        return
    }

    const duplicateNumber = duplicatesInPuzzle(mainNumbers)
    if (duplicateNumber.present) {
        setState({ selectedCell: duplicateNumber.cell })
        showSnackBar({ msg: 'puzzle has multiple numbers in same house', snackBarRenderer })
        return
    }

    const isMultipleSolutionsExist = getNumberOfSolutions(mainNumbers) > 1
    console.log('@@@@@@ mainNumbers after puzzle', JSON.stringify(mainNumbers))
    if (isMultipleSolutionsExist) {
        showSnackBar({ msg: 'puzzle has multiple valid solutions. please input valid puzzle', snackBarRenderer })
    } else {
        setState({ validPuzzleFilled: true }, () => {
            startCustomPuzzle(mainNumbers)
            handleOnClose({ params: customPuzzleHCRef })
        })
    }
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
