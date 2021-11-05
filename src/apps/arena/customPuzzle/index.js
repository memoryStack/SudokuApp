import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { EVENTS, GAME_STATE, SCREEN_NAME } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit, addListener, removeListener } from '../../../utils/GlobalEventBus'
import { Board } from '../gameBoard'
import { NewGameButton } from '../newGameButton'
import { Inputpanel } from '../inputPanel'
import { initBoardData as initMainNumbers, getBlockAndBoxNum, getRowAndCol } from '../../../utils/util'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { getNumberOfSolutions } from '../utils/util'

const INPUT_NUMBER_CLICK_EVENT_PREFIX = 'CUSTOM_PUZZLE_'
const CLOSE_ICON_HITSLOP = { top: 24, left: 24, bottom: 24, right: 24 }
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: '3%', // 94% is te grid size
    },
    closeIconContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    inputPanelContainer: {
        marginVertical: 24
    },
    playButtonContainer: {
        paddingHorizontal: 24,
    },
    snackBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 24,
        backgroundColor: 'rgba(0, 0, 0, .9)', // replace this after talking to designer
        position: 'absolute',
        bottom: 150,
        alignSelf: 'center',
    },
    snackBarText: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    }
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
        selectedCell: { row: 0, col: 0 },
    }
}

const isDuplicateEntry = (mainNumbers, {row, col}, number) => {
    let houseCount = 0
    for (let col=0;col<9;col++)
        if (mainNumbers[row][col].value === number) houseCount++
    if (houseCount > 1) return true
    
    houseCount = 0
    for (let row=0;row<9;row++)
        if (mainNumbers[row][col].value === number) houseCount++
    if (houseCount > 1) return true
    
    houseCount = 0
    const { blockNum } = getBlockAndBoxNum(row, col)
    for (let box=0;box<9;box++) {
        const { row, col } = getRowAndCol(blockNum, box)
        if (mainNumbers[row][col].value === number) houseCount++
    }
    return houseCount > 1
}

// TODO: memory leaks are happening in this component and also NextGameMenu component
//          have to be fixed
const CustomPuzzle_ = ({ parentHeight, onCustomPuzzleClosed, onPuzzleValiditySuccessful }) => {

    const initialBoardData = useRef(initBoardData()).current
    const [mainNumbers, setMainNumbers] = useState(initialBoardData.mainNumbers)
    const [selectedCell, selectCell] = useState(initialBoardData.selectedCell)
    const selectedCellMainValue = useRef(null) // in start it will be empty grid only    
    const customPuzzleRef = useRef(null)

    useEffect(() => {
        const handler = ({ number }) => {
            selectedCellMainValue.current = number
            
            const { row, col } = selectedCell
            const initialValue = mainNumbers[row][col].value
            mainNumbers[row][col].value = number
            mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, selectedCell, number)
            
            if (initialValue && initialValue !== number) {
                // reset "wronglyPlaced" flag for the values which might be
                // converted from wronglyPlaced to correctly placed due to input in this cell
                for (let col=0;col<9;col++) {
                    if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                        mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, {row, col}, initialValue)
                }
                for (let row=0;row<9;row++) {
                    if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                        mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, {row, col}, initialValue)
                }
                const { blockNum } = getBlockAndBoxNum(row, col)
                for (let box=0;box<9;box++) {
                    const { row, col } = getRowAndCol(blockNum, box)
                    if (mainNumbers[row][col].wronglyPlaced && mainNumbers[row][col].value === initialValue)
                        mainNumbers[row][col].wronglyPlaced = isDuplicateEntry(mainNumbers, {row, col}, initialValue)
                }
            }
            setMainNumbers([...mainNumbers])

            // if (!mainNumbers[row][col].wronglyPlaced) {
            //     setTimeout(() => {
            //         let nextCol = col + 1
            //         let nextRow = row
            //         if (nextCol === 9) {
            //             nextCol = 0
            //             nextRow++
            //         }
            //         if (nextRow !== 9)
            //             emit(SCREEN_NAME.CUSTOM_PUZZLE + EVENTS.SELECT_CELL, { row: nextRow, col: nextCol })
            //     }, 100)
            // }
        }
        addListener(INPUT_NUMBER_CLICK_EVENT_PREFIX + EVENTS.INPUT_NUMBER_CLICKED, handler)
        return () => removeListener(INPUT_NUMBER_CLICK_EVENT_PREFIX + EVENTS.INPUT_NUMBER_CLICKED, handler)
    }, [mainNumbers, selectedCell])

    const closeView = useCallback(() => {
        customPuzzleRef.current && customPuzzleRef.current.closeDragger()
    }, [customPuzzleRef])

    const getSnackBarView = msg => {
        return (
            <View style={styles.snackBarContainer}>
                <Text style={styles.snackBarText}>{msg}</Text>
            </View>
        )
    }

    const showSnackBar = msg => {
        emit(EVENTS.SHOW_SNACK_BAR, {
            snackbarView: getSnackBarView(msg),
            visibleTime: 3000,
        })
    }

    const getCluesCount = () => {
        let cluesCount = 0
        for (let row=0;row<9;row++) {
            for (let col=0;col<9;col++) {
                if (mainNumbers[row][col].value) cluesCount++
            }
        }
        return cluesCount
    }

    const handlePlayClick = useCallback(() => {
        // check the validity of the puzzle
        if (getCluesCount() < 18) {
            showSnackBar('clues are less than 18')
        } else {
            const isMultipleSolutionsExist = getNumberOfSolutions(mainNumbers) > 1
            if (isMultipleSolutionsExist) {
                showSnackBar('puzzle has multiple valid solutions. please input valid puzzle')
            } else {
                onPuzzleValiditySuccessful({mainNumbers})
                closeView()
            }
        }
    }, [mainNumbers])

    useEffect(() => {
        const handler = ({row, col}) => {
            selectedCellMainValue.current = mainNumbers[row][col].value
            selectCell(selectedCell => {
                if (selectedCell.row !== row || selectedCell.col !== col) return { row, col }
                return selectedCell
            })
        }
        addListener(SCREEN_NAME.CUSTOM_PUZZLE + EVENTS.SELECT_CELL, handler)
        return () => removeListener(SCREEN_NAME.CUSTOM_PUZZLE + EVENTS.SELECT_CELL, handler)
    }, [mainNumbers])

    useEffect(() => {
        const handler = () => {
            const { row, col } = selectedCell
            mainNumbers[row][col].value = 0
            setMainNumbers([...mainNumbers])
            selectedCellMainValue.current = 0
        }
        addListener(INPUT_NUMBER_CLICK_EVENT_PREFIX + EVENTS.ERASER_CLICKED, handler)
        return () => removeListener(INPUT_NUMBER_CLICK_EVENT_PREFIX + EVENTS.ERASER_CLICKED, handler)
    }, [mainNumbers, selectedCell])

    return (
        <BottomDragger
            parentHeight={parentHeight}
            onDraggerClosed={onCustomPuzzleClosed}
            ref={customPuzzleRef}
            bottomMostPositionRatio={1.1}
            stopBackgroundClickClose={true}
        >
            <View style={styles.container}>
                <Touchable
                    touchable={TouchableTypes.opacity}
                    style={styles.closeIconContainer}
                    onPress={closeView}
                    hitSlop={CLOSE_ICON_HITSLOP}
                >
                    <CloseIcon height={24} width={24} fill={'rgba(0, 0, 0, .8)'} />
                </Touchable>
                <Board
                    screenName={SCREEN_NAME.CUSTOM_PUZZLE}
                    gameState={GAME_STATE.ACTIVE} // else the click on cells wouldn't work
                    mainNumbers={mainNumbers}
                    notesInfo={initialBoardData.notesInfo}
                    selectedCell={selectedCell}
                    selectedCellMainValue={selectedCellMainValue.current}
                />
                <View style={styles.inputPanelContainer}>
                    <Inputpanel 
                        eventsPrefix={INPUT_NUMBER_CLICK_EVENT_PREFIX}
                        gameState={GAME_STATE.ACTIVE}
                    />
                </View>
                <NewGameButton
                    containerStyle={styles.playButtonContainer}
                    onClick={handlePlayClick}
                    text={'PLAY'}
                />
            </View>
        </BottomDragger>
    )
}

export const CustomPuzzle = React.memo(CustomPuzzle_)
