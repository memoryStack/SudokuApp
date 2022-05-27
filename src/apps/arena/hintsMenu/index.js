import React, { useCallback } from 'react'
import { View, Text } from 'react-native'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { styles } from './style'
import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import withActions from '../../../utils/hocs/withActions'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'

const COLUMNS_COUNT = 3

const HintsMenu_ = ({ onAction }) => {
    const onOverlayContainerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS })
    }, [onAction])

    const onMenuItemClick = id => {
        onAction({ type: ACTION_TYPES.ON_MENU_ITEM_PRESS, payload: id })
    }

    const renderMenuItem = ({ label, id }) => {
        return (
            <Touchable
                style={styles.menuItem}
                onPress={() => onMenuItemClick(id)}
                touchable={TouchableTypes.opacity}
                key={label}
            >
                <Text style={styles.menuItemText}>{label}</Text>
            </Touchable>
        )
    }

    const rows = []
    let row = []
    HINTS_MENU_ITEMS.forEach((item, index) => {
        const isLastItem = index === HINTS_MENU_ITEMS.length - 1
        const isLastColumn = index % COLUMNS_COUNT === COLUMNS_COUNT - 1 || isLastItem

        if (row.length) row.push(<View style={styles.verticalSeperator} key={`verticalSep_${index}`} />)
        row.push(renderMenuItem(item))

        if (isLastColumn) {
            if (rows.length) rows.push(<View style={styles.horizontalSeperator} key={`horizoSep_${index}`} />)
            rows.push(
                <View style={styles.menuRowContainer} key={`row_${index}`}>
                    {row}
                </View>,
            )
            row = []
        }
    })

    return (
        <Touchable onPress={onOverlayContainerClick}>
            <View style={styles.overlayContainer}>
                <View style={styles.container}>{rows}</View>
            </View>
        </Touchable>
    )
}

export const HintsMenu = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(HintsMenu_))
