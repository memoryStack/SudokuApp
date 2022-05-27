import React, { useCallback, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { GAME_STATE, SCREEN_NAME } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { Board } from '../gameBoard'
import { Button } from '../../../components/button'
import { Inputpanel } from '../inputPanel'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { PLAY } from '../../../resources/stringLiterals'
import { fonts } from '../../../resources/fonts/font'
import { ACTION_HANDLERS, ACTION_TYPES, INITIAL_STATE } from './actionHandlers'
import withActions from '../../../utils/hocs/withActions'

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
        marginVertical: 24,
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
        fontFamily: fonts.regular,
    },
})

const CustomPuzzle_ = ({
    mainNumbers,
    selectedCell,
    notesInfo,
    parentHeight,
    onCustomPuzzleClosed,
    onAction,
}) => {
    const customPuzzleRef = useRef(null)

    const handleOnClose = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: customPuzzleRef })
    }, [onAction])

    const handlePlayClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PLAY, payload: { ref: customPuzzleRef, snackBarRenderer } })
    }, [mainNumbers])

    const onHCClosed = useCallback(() => {
        onCustomPuzzleClosed()
    }, [])

    const snackBarRenderer = msg => {
        return (
            <View style={styles.snackBarContainer}>
                <Text style={styles.snackBarText}>{msg}</Text>
            </View>
        )
    }

    const onCellClick = useCallback((cell) => {
        onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: cell })
    }, [onAction])

    return (
        <BottomDragger
            parentHeight={parentHeight}
            onDraggerClosed={onHCClosed}
            ref={customPuzzleRef}
            bottomMostPositionRatio={1.1}
            stopBackgroundClickClose={true}
        >
            <View style={styles.container}>
                <Touchable
                    touchable={TouchableTypes.opacity}
                    style={styles.closeIconContainer}
                    onPress={handleOnClose}
                    hitSlop={CLOSE_ICON_HITSLOP}
                >
                    <CloseIcon height={24} width={24} fill={'rgba(0, 0, 0, .8)'} />
                </Touchable>
                <Board
                    gameState={GAME_STATE.ACTIVE}
                    screenName={SCREEN_NAME.CUSTOM_PUZZLE}
                    mainNumbers={mainNumbers}
                    notesInfo={notesInfo}
                    selectedCell={selectedCell}
                    onCellClick={onCellClick}
                />
                <View style={styles.inputPanelContainer}>
                    <Inputpanel onAction={onAction} />
                </View>
                <Button containerStyle={styles.playButtonContainer} onClick={handlePlayClick} text={PLAY} />
            </View>
        </BottomDragger>
    )
}

export const CustomPuzzle = React.memo(withActions({ actionHandlers: ACTION_HANDLERS, initialState: INITIAL_STATE })(CustomPuzzle_))
