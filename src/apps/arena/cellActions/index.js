import React, { useCallback } from "react"
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { Undo } from "./undo"
import { Pencil } from "./pencil"
import { FastPencil } from "./fastPencil"
import { Hint } from "./hint"
import withActions from "../../../utils/hocs/withActions"
import { ACTION_HANDLERS, ACTION_TYPES } from "./actionHandlers"
import { useSelector } from "react-redux"
import { getPencilStatus } from "../store/selectors/boardController.selectors"

const styles = StyleSheet.create({
    cellActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
})

const BoardController_ = ({ 
    onAction
 }) => {

    const pencilState = useSelector( getPencilStatus )

    const { width: windowWidth } = useWindowDimensions()
    const CELL_ACTION_ICON_BOX_DIMENSION = (windowWidth / 100) * 5

    const onUndoClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_UNDO_CLICK })
    }, [onAction])

    const onPencilClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PENCIL_CLICK })
    }, [onAction])

    const onFastPencilClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_FAST_PENCIL_CLICK })
    }, [onAction])

    const onHintClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_HINT_CLICK })
    }, [onAction])

    return (
        <View style={styles.cellActionsContainer}>
            <Undo iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onUndoClick} />
            <Pencil
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                pencilState={pencilState}
                onClick={onPencilClick}
            />
            <FastPencil iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION} onClick={onFastPencilClick} />
            <Hint
                iconBoxSize={CELL_ACTION_ICON_BOX_DIMENSION}
                // hints={hints}
                onClick={onHintClick}
            />
        </View>
    )
}



export const BoardController = React.memo(withActions(ACTION_HANDLERS) (BoardController_))