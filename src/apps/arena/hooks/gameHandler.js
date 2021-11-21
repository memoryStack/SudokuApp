import { useState, useEffect } from 'react'
import { Linking } from 'react-native'
import {
    LEVEL_DIFFICULTIES,
    EVENTS,
    GAME_STATE,
    LEVELS_CLUES_INFO,
    CUSTOMIZED_PUZZLE_LEVEL_TITLE,
} from '../../../resources/constants'
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { shouldSaveGameState, getNumberOfSolutions } from '../utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'
import { usePrevious } from '../../../utils/customHooks'
import { getKey } from '../../../utils/storage'
import { cacheGameData, GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from '../utils/cacheGameHandler'

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

const transformDeeplinkPuzzle = url => {
    console.log('deeplink url is', url)
    const startIndex = url.indexOf('puzzle')
    if (startIndex === -1) {
        // show popup about the format of the url
    }

    // length of puzzle/ is 7
    const boardMainNumbers = url.substring(startIndex + 7)
    console.log(boardMainNumbers)
    if (boardMainNumbers.length < 81) {
        // show some error  about the invalidity of the puzzle link
    } else {
        const mainNumbers = new Array(9)
        let cellNo = 0
        for (let row = 0; row < 9; row++) {
            const rowData = new Array(9)
            for (let col = 0; col < 9; col++) {
                const clueIntValue = parseInt(boardMainNumbers[cellNo], 10)
                if (isNaN(clueIntValue)) {
                    // abort and show invalidity message
                }
                // const cellvalue = clues[cellNo]
                rowData[col] = {
                    value: clueIntValue,
                    solutionValue: '',
                    isClue: clueIntValue !== 0,
                }
                cellNo++
            }
            mainNumbers[row] = rowData
        }

        // let's check if the puzzle is valid or not ?
        if (getNumberOfSolutions(mainNumbers) === 1) {
            // puzzle can be started
            emit(EVENTS.START_DEEPLINK_PUZZLE, { mainNumbers })
        } else {
            // show  error message and  don't start the puzzle
        }
    }
}

const useManageGame = () => {
    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    const previousGameState = usePrevious(gameState)
    const [showNextGameMenu, setShowNextGameMenu] = useState(false)

    // resume previous game or start new game of previously solved level or take care of deeplinking
    useEffect(() => {
        const handler = async () => {
            // TODO: error handling
            const initialUrl = await Linking.getInitialURL()
            if (initialUrl) {
                transformDeeplinkPuzzle(initialUrl)
                return
            }

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
        handler()
    }, [])

    useEffect(() => {
        const handler = newState => newState && setGameState(newState)
        addListener(EVENTS.CHANGE_GAME_STATE, handler)
        return () => removeListener(EVENTS.CHANGE_GAME_STATE, handler)
    }, [])

    useEffect(() => {
        let componentUnmounted = false
        const handler = ({ difficultyLevel }) => {
            if (!difficultyLevel) return
            // "minClues" becoz sometimes for the expert type of levels we get more than desired clues
            const time = Date.now()
            const minClues = LEVELS_CLUES_INFO[difficultyLevel]
            // now as i changed the position of "timeTaken" reading after the puzzle has
            // been generated looks like that puzzle algo was never a big issue. it was just the setStates latency
            // TODO: Research on this setState issue.
            RNSudokuPuzzle.getSudokuPuzzle(minClues)
                .then(({ clues, solution }) => {
                    if (!componentUnmounted) {
                        timeTaken = Date.now() - time
                        console.log('@@@@@@@@ time taken is to generate new puzzle is', timeTaken)
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

    // app was in background ad brought to fore-ground by deeplink
    useEffect(() => {
        const handler = ({ url }) => transformDeeplinkPuzzle(url)
        Linking.addEventListener('url', handler)
        return () => Linking.removeEventListener('url', handler)
    }, [transformDeeplinkPuzzle])

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
