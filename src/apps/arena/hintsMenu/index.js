import React, { useEffect, useCallback } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'

import { Platform } from '@utils/classes/platform'

import Text from '@ui/atoms/Text'
import StopTouchPropagation from '@ui/molecules/StopTouchPropagation'

import withActions from '../../../utils/hocs/withActions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import {
    HINTS_MENU_CONTAINER_TEST_ID,
    HINTS_MENU_OVERLAY_TEST_ID,
    HINT_MENU_ITEM_TEST_ID,
} from './hintsMenu.constants'
import { styles } from './hintsMenu.styles'

const COLUMNS_COUNT = 3

const HintsMenu_ = ({ onAction, availableRawHints }) => {
    const { mainNumbers, notes } = useGameBoardInputs()

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: { mainNumbers, notes },
        })
    }, [])

    const onOverlayContainerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS })
    }, [onAction])

    const onMenuItemClick = id => {
        onAction({
            type: ACTION_TYPES.ON_MENU_ITEM_PRESS,
            payload: { id, mainNumbers, notes },
        })
    }

    const renderMenuItem = ({ label, id }) => {
        const isNotAvailable = _isEmpty(_get(availableRawHints, id))

        return (
            <StopTouchPropagation
                style={[styles.menuItem, isNotAvailable ? styles.disabledMenuItem : null]}
                key={label}
            >
                <Touchable
                    style={[styles.menuItem, isNotAvailable ? styles.disabledMenuItem : null]}
                    onPress={() => onMenuItemClick(id)}
                    disabled={isNotAvailable}
                    testID={HINT_MENU_ITEM_TEST_ID}
                >
                    <Text style={[styles.menuItemText, isNotAvailable ? styles.disabledMenuItemText : null]}>
                        {label}
                    </Text>
                </Touchable>
            </StopTouchPropagation>
        )
    }

    const renderVerticalSeparator = key => <View style={styles.verticalSeperator} key={key} />

    const renderHorizontalSeparator = key => <View style={styles.horizontalSeperator} key={key} />

    const menuRows = []
    let menuRow = []

    const isLastMenuItem = index => index === HINTS_MENU_ITEMS.length - 1

    const isRowLastItem = index => index % COLUMNS_COUNT === COLUMNS_COUNT - 1 || isLastMenuItem(index)

    const addMenuItemInRow = (item, index) => {
        menuRow.push(renderMenuItem(item))
        if (!isRowLastItem(index)) menuRow.push(renderVerticalSeparator(`verticalSep_${index}`))
    }

    const renderMenuRow = rowKey => (
        <View style={styles.menuRowContainer} key={rowKey}>
            {menuRow}
        </View>
    )

    const addMenuRow = rowKey => {
        if (menuRows.length) menuRows.push(renderHorizontalSeparator(`horizoSep_${menuRows.length}`))
        menuRows.push(renderMenuRow(rowKey))
        menuRow = []
    }

    HINTS_MENU_ITEMS.forEach((item, index) => {
        addMenuItemInRow(item, index)
        if (isRowLastItem(index)) addMenuRow(`row_${index}`)
    })

    return (
        <Touchable
            onPress={onOverlayContainerClick}
            touchable={Platform.isIOS() ? TouchableTypes.highLight : TouchableTypes.nativeFeedBack}
            testID={HINTS_MENU_OVERLAY_TEST_ID}
        >
            <View style={styles.overlayContainer}>
                <View style={styles.container} testID={HINTS_MENU_CONTAINER_TEST_ID}>
                    {menuRows}
                </View>
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
