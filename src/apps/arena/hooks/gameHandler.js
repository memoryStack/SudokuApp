import { useState, useEffect } from 'react'
import { Linking } from 'react-native'
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
import { usePrevious } from '../../../utils/customHooks'
import { getKey } from '../../../utils/storage'
import { cacheGameData, GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'
import {
    INVALID_DEEPLINK_PUZZLE,
    LAUNCHING_PREVIOUS_PUZZLE,
    DEEPLINK_PUZZLE_NO_SOLUTIONS,
} from '../../../resources/stringLiterals'

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
    const startIndex = url.indexOf(DEEPLINK_HOST_NAME)
    if (startIndex === -1) {
        emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_PREVIOUS_PUZZLE}` })
        return
    }

    const boardMainNumbers = url.substring(DEEPLINK_HOST_NAME.length)
    if (boardMainNumbers.length !== 81) {
        emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_PREVIOUS_PUZZLE}` })
        return
    }

    const mainNumbers = new Array(9)
    let cellNo = 0
    for (let row = 0; row < 9; row++) {
        const rowData = new Array(9)
        for (let col = 0; col < 9; col++) {
            const clueIntValue = parseInt(boardMainNumbers[cellNo], 10)
            if (isNaN(clueIntValue)) {
                emit(EVENTS.SHOW_SNACK_BAR, { msg: `${INVALID_DEEPLINK_PUZZLE} ${LAUNCHING_PREVIOUS_PUZZLE}` })
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

const useManageGame = () => {
    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const previousGameState = usePrevious(gameState)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    const handleDeeplinkPuzzleLaunch = url => {
        let startDefaultPuzzleProcess = true
        if (url) startDefaultPuzzleProcess = !verifyDeeplinkAndStartPuzzle(url)
        startDefaultPuzzleProcess && emit(EVENTS.START_DEFAULT_GAME_PROCESS)
    }

    useEffect(() => {
        Linking.getInitialURL()
            .then(url => {
                handleDeeplinkPuzzleLaunch(url)
            })
            .catch(error => {
                console.log(__DEV__ && error)
                emit(EVENTS.START_DEFAULT_GAME_PROCESS)
            })
    }, [])

    // app was in background and brought to fore-ground by deeplink
    useEffect(() => {
        const handler = ({ url }) => handleDeeplinkPuzzleLaunch(url)
        Linking.addEventListener('url', handler)
        return () => Linking.removeEventListener('url', handler)
    }, [])

    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    useEffect(() => {
        const handler = async () => {
            const previousGameData = await getKey(PREVIOUS_GAME_DATA_KEY)
            if (previousGameData) {
                const state = previousGameData[GAME_DATA_KEYS.STATE]
                const refereeData = previousGameData[GAME_DATA_KEYS.REFEREE]
                if (state !== GAME_STATE.INACTIVE) {
                    emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: refereeData.difficultyLevel })
                } else {
                    // TODO: figure out if setTimeout needs to be removed or not
                    // it's very imp. thing to do. for now keep it in setTimeout. (it works without use of setTimeout as well)
                    // read about microtasks and asynchronous in JS and find out when/where
                    // useEffects run and figure out whole thing about promise/eventLoop as well
                    setTimeout(() => {
                        emit(EVENTS.RESUME_PREVIOUS_GAME, previousGameData)
                        setGameState(GAME_STATE.ACTIVE)
                    }, 0)
                }
            } else {
                emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: LEVEL_DIFFICULTIES.EASY })
            }
        }
        addListener(EVENTS.START_DEFAULT_GAME_PROCESS, handler)
        return () => removeListener(EVENTS.START_DEFAULT_GAME_PROCESS, handler)
    }, [])

    useEffect(() => {
        let componentUnmounted = false
        const handler = ({ difficultyLevel }) => {
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const minClues = LEVELS_CLUES_INFO[difficultyLevel]
            // now as i changed the position of "timeTaken" reading after the puzzle has
            // been generated looks like that puzzle algo was never a big issue. it was just the setStates latency
            // TODO: Research on this setState issue.
            RNSudokuPuzzle.getSudokuPuzzle(minClues)
                .then(({ clues, solution }) => {
                    if (!componentUnmounted) {
                        const mainNumbers = transformNativeGeneratedPuzzle(clues, solution)
                        emit(EVENTS.START_NEW_GAME, { difficultyLevel, mainNumbers })
                        setGameState(GAME_STATE.ACTIVE)
                    }
                })
                .catch(error => {
                    __DEV__ && console.log(error)
                })

            // puzzle generator in JS
            // generateNewSudokuPuzzle(minClues, boardData.mainNumbers)
            // .then(() => {
            //     if (!componentUnmounted) {
            //         timeTaken = Date.now() - time
            //         setBoardData(boardData)
            //         setRefereeData(initRefereeData(difficultyLevel))
            //         resetCellActions()
            //         onNewGameStarted()
            //     }
            //     console.log('@@@@@@@@ time taken is to generate new puzzle is', timeTaken)
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
            setGameState(GAME_STATE.ACTIVE)
        }
        addListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
        return () => removeListener(EVENTS.START_CUSTOM_PUZZLE_GAME, handler)
    }, [])

    useEffect(() => {
        const handler = ({ mainNumbers }) => {
            emit(EVENTS.START_NEW_GAME, { difficultyLevel: 'Shared Puzzle', mainNumbers })
            setGameState(GAME_STATE.ACTIVE)
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

    return {
        gameState,
        showNextGameMenu,
        setShowNextGameMenu,
    }
}

export { useManageGame }