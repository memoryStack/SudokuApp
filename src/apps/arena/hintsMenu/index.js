import React from 'react'
import { View, Text } from 'react-native'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../resources/constants'
import { noOperationFunction } from '../../../utils/util'
import { styles } from './style'
import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'

const COLUMNS_COUNT = 2

const HintsMenu_ = ({ visibilityToggler = noOperationFunction }) => {
    const handleItemClicked = id => {
        emit(EVENTS.SHOW_SELECTIVE_HINT, { id })
        visibilityToggler()
    }

    const renderMenuItem = ({ label, id }) => {
        return (
            <Touchable
                style={styles.menuItem}
                onPress={() => handleItemClicked(id)}
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
        <Touchable onPress={visibilityToggler}>
            <View style={styles.overlayContainer}>
                <View style={styles.container}>{rows}</View>
            </View>
        </Touchable>
    )
}

export const HintsMenu = React.memo(HintsMenu_)
