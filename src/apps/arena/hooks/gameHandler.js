import { useState, useEffect } from 'react'
import {
    LEVEL_DIFFICULTIES,
    EVENTS,
    GAME_STATE,
    LEVELS_CLUES_INFO,
    CUSTOMIZED_PUZZLE_LEVEL_TITLE,
    DEEPLINK_HOST_NAME,
} from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { shouldSaveGameState, getNumberOfSolutions } from '../utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { usePrevious } from '../../../utils/customHooks/commonUtility'
import { getKey } from '../../../utils/storage'
import { cacheGameData, GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import {
    INVALID_DEEPLINK_PUZZLE,
    LAUNCHING_DEFAULT_PUZZLE,
    DEEPLINK_PUZZLE_NO_SOLUTIONS,
    RESUME,
    CUSTOMIZE_YOUR_PUZZLE_TITLE,
} from '../../../resources/stringLiterals'
import { updateGameState } from '../store/actions/gameState.actions'
import { useSelector } from 'react-redux'
import { getGameState } from '../store/selectors/gameState.selectors'
import { consoleLog } from '../../../utils/util'

const transformNativeGeneratedPuzzle = (clues, solution) => {
    const mainNumbers = new Array(9)
    let cellNo = 0
    for (let row = 0; row < 9; row++) {
        const rowData = new Array(9)
        for (let col = 0; col < 9; col++) {
            const cellvalue = clues[cellNo]
            rowData[col] = {
                value: cellvalue,
                solutionValue: solution[cellNo],
                isClue: cellvalue !== 0,
            }
            cellNo++
        }
        mainNumbers[row] = rowData
    }
    return mainNumbers
}

// returns true if the deeplink puzzle is valid
const verifyDeeplinkAndStartPuzzle = url => {
    // TODO: change this message LAUNCHING_PREVIOUS_PUZZLE to something that suits it
    const startIndex = url.indexOf(DEEPLINK_HOST_NAME)
    if (startIndex === -1) {
        emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_DEFAULT_PUZZLE}` })
        return
    }

    const boardMainNumbers = url.substring(DEEPLINK_HOST_NAME.length)
    if (boardMainNumbers.length !== 81) {
        emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_DEFAULT_PUZZLE}` })
        return
    }

    const mainNumbers = new Array(9)
    let cellNo = 0
    for (let row = 0; row < 9; row++) {
        const rowData = new Array(9)
        for (let col = 0; col < 9; col++) {
            const clueIntValue = parseInt(boardMainNumbers[cellNo], 10)
            if (isNaN(clueIntValue)) {
                emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_DEFAULT_PUZZLE}` })
                return
            }
            rowData[col] = {
                value: clueIntValue,
                solutionValue: '',
                isClue: clueIntValue !== 0,
            }
            cellNo++
        }
        mainNumbers[row] = rowData
    }

    // TODO: invalid puzzles scenarios can be handled in a better way, the ways that
    // will give better insight to the user about what's went wrong
    const numberOfSolutions = getNumberOfSolutions(mainNumbers)
    switch (numberOfSolutions) {
        case 0:
            emit(EVENTS.SHOW_SNACK_BAR, { msg: `${DEEPLINK_PUZZLE_NO_SOLUTIONS} ${LAUNCHING_PREVIOUS_PUZZLE}` })
            break
        case 1:
            emit(EVENTS.START_DEEPLINK_PUZZLE, { mainNumbers })
            return true
        default:
            emit(EVENTS.SHOW_SNACK_BAR, { msg: `${DEEPLINK_PUZZLE_NO_SOLUTIONS} ${LAUNCHING_PREVIOUS_PUZZLE}` })
    }
}

// manage the logic related to custom puzzle HC
// TODO: this can made generic state handler for all the HCs
const useCustomPuzzleHC = () => {
    const [show, setShowCustomPuzzleHC] = useState(false)

    // TODO: see if it's needed to put this in useCallback or not
    const closeView = () => setShowCustomPuzzleHC(false)

    useEffect(() => {
        const handler = () => setShowCustomPuzzleHC(true)
        addListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
        return () => removeListener(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW, handler)
    }, [])

    return {
        show,
        closeView,
    }
}

const useManageGame = route => {
    const { params: { puzzleUrl = '', selectedGameMenuItem = '' } = {} } = route || {}

    const gameState = useSelector(getGameState)

    const previousGameState = usePrevious(gameState)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const { show: showCustomPuzzleHC, closeView: closeCustomPuzzleHC } = useCustomPuzzleHC()

    useEffect(() => {
        const handler = newState => updateGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    useEffect(() => {
        let componentUnmounted = false
        const handler = ({ difficultyLevel }) => {
            consoleLog('@@@@@@ difficulty level', difficultyLevel)
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const minClues = 70 // LEVELS_CLUES_INFO[difficultyLevel]
            // now as i changed the position of "timeTaken" reading after the puzzle has
            // been generated looks like that puzzle algo was never a big issue. it was just the setStates latency
            // TODO: Research on this setState issue.
            RNSudokuPuzzle.getSudokuPuzzle(minClues)
                .then(({ clues, solution }) => {
                    if (!componentUnmounted) {
                        const mainNumbers = transformNativeGeneratedPuzzle(clues, solution)
                        emit(EVENTS.START_NEW_GAME, { difficultyLevel, mainNumbers })
                        updateGameState(GAME_STATE.ACTIVE)
                    }
                })
                .catch(error => {
                    __DEV__ && console.log(error)
                })

            // puzzle generator in JS
            // generateNewSudokuPuzzle(minClues, initBoardData()).then(() => {
            //     console.log('no error')
            //     // if (!componentUnmounted) {
            //     //     // timeTaken = Date.now() - time
            //     //     // setBoardData(boardData)
            //     //     // setRefereeData(initRefereeData(difficultyLevel))
            //     //     // resetCellActions()
            //     //     // onNewGameStarted()
            //     // }
            //     // console.log('@@@@@@@@ time taken is to generate new puzzle is', timeTaken)
            // })
        }

        addListener(EVENTS.GENERATE_NEW_PUZZLE, handler)
        return () => {
            removeListener(EVENTS.GENERATE_NEW_PUZZLE, handler)
            componentUnmounted = true
        }
    }, [transformNativeGeneratedPuzzle])

    // these 2 below listeners can be combined
    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            // drag the customPuzzle HC and we can simply unmount the
            // next game menu from view hirerechy
            setShowNextGameMenu(false)
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: CUSTOMIZED_PUZZLE_LEVEL_TITLE, mainNumbers })
            updateGameState(GAME_STATE.ACTIVE)
        }
        addListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
        return () => removeListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
    }, [])

    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            setTimeout(() => {
                emit(EVENTS.START_NEW_GAME, { difficultyLevel: 'Shared Puzzle', mainNumbers })
                updateGameState(GAME_STATE.ACTIVE)
            }, 0)
        }
        addListener(EVENTS.START_DEEPLINK_PUZZLE, handler)
        return () => removeListener(EVENTS.START_DEEPLINK_PUZZLE, handler)
    }, [])

    // cache game data
    useEffect(() => {
        if (shouldSaveGameState(gameState, previousGameState)) {
            cacheGameData(GAME_DATA_KEYS.STATE, gameState)
            emit(EVENTS.CACHE_GAME_DATA)
        }
    }, [gameState])

    // TODO: what if the puzzle is already solved ??
    useEffect(() => {
        if (!puzzleUrl) return
        let startDefaultPuzzleProcess = true
        if (puzzleUrl) startDefaultPuzzleProcess = !verifyDeeplinkAndStartPuzzle(puzzleUrl)
        startDefaultPuzzleProcess && emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: LEVEL_DIFFICULTIES.EASY })
    }, [puzzleUrl])

    useEffect(() => {
        if (!selectedGameMenuItem) return
        switch (selectedGameMenuItem) {
            case LEVEL_DIFFICULTIES.EASY:
            case LEVEL_DIFFICULTIES.MEDIUM:
            case LEVEL_DIFFICULTIES.HARD:
            case LEVEL_DIFFICULTIES.EXPERT:
                emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: selectedGameMenuItem })
                break
            case RESUME:
                getKey(PREVIOUS_GAME_DATA_KEY)
                    .then(previousGameData => {
                        emit(EVENTS.RESUME_PREVIOUS_GAME, previousGameData)
                        emit(EVENTS.CHANGE_GAME_STATE, GAME_STATE.ACTIVE)
                    })
                    .catch(error => {
                        __DEV__ && console.log(error)
                    })
                break
            case CUSTOMIZE_YOUR_PUZZLE_TITLE:
                emit(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW)
                break
            default:
                __DEV__ && console.log('@@@@ starting easy puzzle')
                emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: LEVEL_DIFFICULTIES.EASY })
        }
    }, [selectedGameMenuItem])

    return {
        showNextGameMenu,
        setShowNextGameMenu,
        showCustomPuzzleHC,
        closeCustomPuzzleHC,
    }
}

export { useManageGame }
