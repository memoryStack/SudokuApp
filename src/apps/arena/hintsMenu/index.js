import React, { useEffect, useCallback, useRef } from 'react'

import { View, Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'
import _get from 'lodash/src/utils/get'
import _isEmpty from 'lodash/src/utils/isEmpty'

import withActions from '../../../utils/hocs/withActions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { styles } from './style'

const COLUMNS_COUNT = 3

const HintsMenu_ = ({ onAction, availableRawHints }) => {
    const { mainNumbers, notesInfo } = useGameBoardInputs()

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: { mainNumbers, notesInfo },
        })
    }, [])

    const onOverlayContainerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS })
    }, [onAction])

    const onMenuItemClick = id => {
        onAction({
            type: ACTION_TYPES.ON_MENU_ITEM_PRESS,
            payload: { id, mainNumbers, notesInfo },
        })
    }

    const renderMenuItem = ({ label, id }) => {
        const isAvailable = !_isEmpty(_get(availableRawHints, id))
        // can't use disabled prop as it propogates the click event to parent
        // component. is there way to solve it without this onPress hack ??
        return (
            <Touchable
                key={label}
                style={[styles.menuItem, !isAvailable ? styles.disabledMenuItem : null]}
                onPress={isAvailable ? () => onMenuItemClick(id) : _noop}
                touchable={TouchableTypes.opacity}
            >
                <Text style={[styles.menuItemText, !isAvailable ? styles.disabledMenuItemText : null]}>{label}</Text>
            </Touchable>
        )
    }

    const renderVerticalSeparator = key => {
        return <View style={styles.verticalSeperator} key={key} />
    }

    const renderHorizontalSeparator = key => {
        return <View style={styles.horizontalSeperator} key={key} />
    }

    const menuRows = []
    let menuRow = []

    const isLastMenuItem = index => {
        return index === HINTS_MENU_ITEMS.length - 1
    }

    const isRowLastItem = index => {
        return index % COLUMNS_COUNT === COLUMNS_COUNT - 1 || isLastMenuItem(index)
    }

    const addMenuItemInRow = (item, index) => {
        menuRow.push(renderMenuItem(item))
        if (!isRowLastItem(index)) menuRow.push(renderVerticalSeparator(`verticalSep_${index}`))
    }

    const renderMenuRow = () => {
        return (
            <View style={styles.menuRowContainer} key={`row_${menuRows.length}`}>
                {menuRow}
            </View>
        )
    }

    const addMenuRow = () => {
        if (menuRows.length) menuRows.push(renderHorizontalSeparator(`horizoSep_${menuRows.length}`))
        menuRows.push(renderMenuRow())
        menuRow = []
    }

    HINTS_MENU_ITEMS.forEach((item, index) => {
        addMenuItemInRow(item, index)
        if (isRowLastItem(index)) addMenuRow()
    })

    return (
        <Touchable onPress={onOverlayContainerClick}>
            <View style={styles.overlayContainer}>
                <View style={styles.container}>{menuRows}</View>
            </View>
        </Touchable>
    )
}

export const HintsMenu = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(HintsMenu_))

HintsMenu_.propTypes = {
    onAction: PropTypes.func,
    availableRawHints: PropTypes.object,
}

HintsMenu_.defaultProps = {
    onAction: _noop,
    availableRawHints: {},
}
