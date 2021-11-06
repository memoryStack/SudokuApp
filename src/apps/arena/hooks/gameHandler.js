import { useRef, useState, useEffect, useCallback } from 'react'
import { LEVEL_DIFFICULTIES, PREVIOUS_GAME, EVENTS, GAME_STATE, LEVELS_CLUES_INFO } from '../../../resources/constants';
import { addListener, emit, removeListener } from '../../../utils/GlobalEventBus'
import { getKey } from '../../../utils/storage'
import { isGameOver } from '../utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

/**
 * START_PREVIOUS_GAME
 * START_NEW_GAME
 * RESTART_GAME
 */

const transformNativeGeneratedPuzzle = (clues, solution) => {
    const mainNumbers = new Array(9)
    let cellNo = 0;
    for (let row=0;row<9;row++) {
        const rowData = new Array(9)
        for (let col=0;col<9;col++) {
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

const useManageGame = () => {
    const [gameState, setGameState] = useState(GAME_STATE.INACTIVE)
    
    useEffect(() => {
        const handler = () => {

        }
        // addListener()
        // return () => {
        //     removeListener(EVENTS)
        // }
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
            }).catch(error => {
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
    }, [])

    return {
        gameState,
    }
}

export {
    useManageGame,
}