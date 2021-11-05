import React, { useCallback, useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { NewGameButton } from '../arena/newGameButton'
import { CustomPuzzle } from '../arena/customPuzzle'
import { Board } from '../arena/gameBoard'
import { NextGameMenu, CUSTOMIZE_YOUR_PUZZLE_TITLE } from '../arena/nextGameMenu'
import { GAME_STATE, SCREEN_NAME, LEVELS_CLUES_INFO } from '../../resources/constants'
import { initBoardData as initMainNumbers, noOperationFunction } from '../../utils/util'
import { RNSudokuPuzzle } from 'fast-sudoku-puzzles'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    roomIDContainer: {
        flexDirection: 'row',
        width: '80%',
        marginVertical: 40,
    },
    difficultyLevel: { marginBottom: 4 },
    gameSelectionAndStartContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: 50,
    },
})

const initBoardData = () => {
    const movesStack = []
    const mainNumbers = initMainNumbers()
    const notesInfo = new Array(9)
    for(let i = 0;i < 9;i++) {
        const rowNotes = []
        for(let j = 0;j < 9;j++) {
            const boxNotes = new Array(9)
            for(let k = 1;k <= 9;k++)
                boxNotes[k-1] = { noteValue: k, show: 0 } // this structure can be re-written using [0, 0, 0, 4, 0, 6, 0, 0, 0] represenstion. but let's ignore it for now
            rowNotes.push(boxNotes)
        }
        notesInfo[i] = rowNotes
    }

    return {
        movesStack,
        notesInfo,
        mainNumbers,
        selectedCell: { row: -1, col: -1 },
    }
}

// TODO: check if i can use windowHeight or not here instead of parentHeight 
//       because it forcing me to add a func in multiple files. or can i make
//       a custom hook to remove this duplication of code??
// TODO: change the name of NextGameMenu component too GameMenu i.e. to something generic
const HostGame_ = ({ navigation }) => { 

    const initialBoardData = useRef(initBoardData()).current
    const [mainNumbers, setMainNumbers] = useState(initialBoardData.mainNumbers)
    const [pageHeight, setPageHeight] = useState(0)
    const [showCustomPuzzleHC, setShowCustomPuzzleHC] = useState(false)
    const [showGameMenu, setShowGameMenu] = useState(false)
    const [selectedPuzzle, setSelectedPuzzle] = useState(false)    
    const [roomID, setRoomID] = useState(null)
    const [difficultyLevel, setDifficultyLevel] = useState(null)
    const gameMenuRef = useRef(null)

    useEffect(() => {
        // fetch the roomID and repeat this action when refresh button
        // is clicked and hide the refresh button once the ID is received
    }, [])

    const handleSelectPuzzleClick = useCallback(() => {
        setShowGameMenu(true)
    }, [])

    const handleStartGameClick = useCallback(() => {
        if (!selectedPuzzle) {
            // nudge user about the issue
        } else {
            navigation.navigate('Arena', { mainNumbers, difficultyLevel })
        }
    }, [selectedPuzzle, mainNumbers, difficultyLevel])

    const onParentLayout = useCallback(({ nativeEvent: { layout: { height = 0 } = {} } = {} }) => { 
        setPageHeight(height)
    }, [])

    const onGameMenuClosed = useCallback(() => {
        setShowGameMenu(false)
    }, [])

    const getAutomatedPuzzle = difficultyLevel => {
        const minClues = LEVELS_CLUES_INFO[difficultyLevel]
        if (!minClues) return
        RNSudokuPuzzle.getSudokuPuzzle(minClues)
        .then(({ clues, solution }) => {
            let cellNo = 0
            for (let row=0;row<9;row++) {
                for (let col=0;col<9;col++) {
                    const cellvalue = clues[cellNo]
                    mainNumbers[row][col] = {
                        value: cellvalue,
                        solutionValue: solution[cellNo],
                        isClue: cellvalue !== 0,
                    }
                    cellNo++
                }
            }
            setMainNumbers([...mainNumbers])
            setDifficultyLevel(difficultyLevel)
            setSelectedPuzzle(true)
        })
    }

    const handleMenuItemClicked = useCallback((item) => {
        switch (item) {
            case CUSTOMIZE_YOUR_PUZZLE_TITLE:
                setShowCustomPuzzleHC(true)
                break
            default: {
                gameMenuRef.current && gameMenuRef.current.closeDragger()
                getAutomatedPuzzle(item)
            }
        }
    }, [mainNumbers, difficultyLevel])

    const handleCustomPuzzleClosed = useCallback(() => {
        setShowCustomPuzzleHC(false)
    }, [])

    const onCustomPuzzleValiditySuccessful = useCallback(({ mainNumbers }) => {
        setMainNumbers(mainNumbers)
        setSelectedPuzzle(true)
        setShowGameMenu(false)
        setDifficultyLevel(CUSTOMIZE_YOUR_PUZZLE_TITLE)
    }, [])

    return (
        <View
            style={styles.container}
            onLayout={onParentLayout}
        >
            <View style={styles.roomIDContainer}>
                <Text>{'Room ID:'}</Text>
                {/*  add a loader here  */}
            </View>
            <Text style={styles.difficultyLevel}>{selectedPuzzle ? difficultyLevel : 'Select Puzzle'}</Text>
            <Board
                screenName={SCREEN_NAME.CREATE_ROOM}
                gameState={GAME_STATE.ACTIVE} // else the click on cells wouldn't work
                mainNumbers={mainNumbers}
                notesInfo={initialBoardData.notesInfo}
                selectedCell={initialBoardData.selectedCell}
                selectedCellMainValue={null}
                onCellClick={noOperationFunction}
            />
            <View style={styles.gameSelectionAndStartContainer}>
                <NewGameButton
                    onClick={handleSelectPuzzleClick}
                    text={'Select Puzzle'}
                />
                <NewGameButton
                    onClick={handleStartGameClick}
                    text={'Start Game'}
                />
            </View>
            {
                pageHeight && showGameMenu ?
                    <NextGameMenu
                        parentHeight={pageHeight}
                        menuItemClick={handleMenuItemClicked}
                        onMenuClosed={onGameMenuClosed}
                        nextGameMenuRef={gameMenuRef}
                    />
                : null
            }
            {
                pageHeight && showCustomPuzzleHC ?
                    <CustomPuzzle
                        parentHeight={pageHeight}
                        onCustomPuzzleClosed={handleCustomPuzzleClosed}
                        onPuzzleValiditySuccessful={onCustomPuzzleValiditySuccessful}
                    />
                : null
            }
        </View>
    )
}

export const HostGame = React.memo(HostGame_)
