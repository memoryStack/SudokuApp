import React, { useEffect, useCallback } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'

import { Platform } from '@utils/classes/platform'

import Text from '@ui/atoms/Text'
import StopTouchPropagation from '@ui/molecules/StopTouchPropagation'

import { useStyles } from '@utils/customHooks/useStyles'
import { emit } from '@utils/GlobalEventBus'

import { useDependency } from '../../../hooks/useDependency'
import { EVENTS } from '../../../constants/events'
import withActions from '../../../utils/hocs/withActions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { HINTS_MENU_ITEMS } from '../utils/smartHints/constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { useThemeValues } from '../hooks/useTheme'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import {
    HINTS_MENU_CONTAINER_TEST_ID,
    HINTS_MENU_OVERLAY_TEST_ID,
    HINT_MENU_ITEM_TEST_ID,
} from './hintsMenu.constants'
import { getStyles } from './hintsMenu.styles'

const COLUMNS_COUNT = 3

const HintsMenu_ = ({
    onAction, availableRawHints, hintsAnalyzed, availableHintsCount,
}) => {
    const dependencies = useDependency()

    const { mainNumbers, notes } = useGameBoardInputs()

    const styles = useStyles(getStyles)

    const theme = useThemeValues()

    useEffect(() => {
        if (_isEmpty(mainNumbers) || _isEmpty(notes)) return
        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: { mainNumbers, notes },
        })
    }, [onAction, mainNumbers, notes])

    useEffect(() => {
        if (hintsAnalyzed && availableHintsCount === 0) {
            emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                msg: 'Oops! no hints are found\nPlease check if all the cells are filled with all the guesses properly. Use Pencil if not done already.',
                visibleTime: 7000,
                customStyles: {
                    bottom: 50,
                },
            })
        }
    }, [availableHintsCount, hintsAnalyzed])

    const onOverlayContainerClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_OVERLAY_CONTAINER_PRESS, payload: { dependencies } })
    }, [onAction, dependencies])

    const onMenuItemClick = id => {
        onAction({
            type: ACTION_TYPES.ON_MENU_ITEM_PRESS,
            payload: {
                id,
                mainNumbers,
                notes,
                smartHintsColorSystem: _get(theme, 'colors.smartHints'),
                dependencies,
            },
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
    hintsAnalyzed: PropTypes.bool,
    availableHintsCount: PropTypes.number,
}

HintsMenu_.defaultProps = {
    onAction: _noop,
    availableRawHints: {},
    hintsAnalyzed: false,
    availableHintsCount: 0,
}
