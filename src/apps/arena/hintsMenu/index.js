import React, { useEffect, useCallback, useMemo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'

import { Platform } from '@utils/classes/platform'

import Text from '@ui/atoms/Text'
import StopTouchPropagation from '@ui/molecules/StopTouchPropagation'

import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../../i18n/hooks/useTranslation'


import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { HINTS_IDS } from '../utils/smartHints/constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { useThemeValues } from '../hooks/useTheme'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import {
    HINTS_MENU_CONTAINER_TEST_ID,
    HINTS_MENU_OVERLAY_TEST_ID,
    HINT_MENU_ITEM_TEST_ID,
} from './hintsMenu.constants'
import { getStyles } from './hintsMenu.styles'
import { getHintExplanationTexts, getHintsTitle } from '../utils/smartHints/stringLiterals'
import { useSmartHintsTranslations } from 'src/apps/hintsVocabulary/vocabExplainations/hooks/useSmartHintsTranslations'

const COLUMNS_COUNT = 3

const HintsMenu_ = ({ onAction, availableRawHints }) => {
    const dependencies = useDependency()

    const { mainNumbers, notes } = useGameBoardInputs()

    const styles = useStyles(getStyles)
    const { t } = useTranslation('arena')

    const smartHintsTranslationsTexts = useSmartHintsTranslations()

    const theme = useThemeValues()

    const HINT_LABELS = {
        [HINTS_IDS.NAKED_SINGLE]: t('hintsMenu.nakedSingle', 'Naked\nSingle'),
        [HINTS_IDS.HIDDEN_SINGLE]: t('hintsMenu.hiddenSingle', 'Hidden\nSingle'),
        [HINTS_IDS.NAKED_DOUBLE]: t('hintsMenu.nakedDouble', 'Naked\nDouble'),
        [HINTS_IDS.HIDDEN_DOUBLE]: t('hintsMenu.hiddenDouble', 'Hidden\nDouble'),
        [HINTS_IDS.NAKED_TRIPPLE]: t('hintsMenu.nakedTripple', 'Naked\nTripple'),
        [HINTS_IDS.HIDDEN_TRIPPLE]: t('hintsMenu.hiddenTripple', 'Hidden\nTripple'),
        [HINTS_IDS.X_WING]: t('hintsMenu.xWing', 'X-Wing'),
        [HINTS_IDS.Y_WING]: t('hintsMenu.yWing', 'Y-Wing'),
        [HINTS_IDS.OMISSION]: t('hintsMenu.omission', 'Omission'),
        [HINTS_IDS.REMOTE_PAIRS]: t('hintsMenu.remotePairs', 'Remote Pairs'),
        [HINTS_IDS.EMPTY_RECTANGLE]: t('hintsMenu.emptyRectangle', 'Empty Rectangle'),
        [HINTS_IDS.X_CHAIN]: t('hintsMenu.xChain', 'X-Chain'),
        [HINTS_IDS.XY_CHAIN]: t('hintsMenu.xyChain', 'XY-Chain'),
        [HINTS_IDS.W_WING]: t('hintsMenu.wWing', 'W-Wing'),
        [HINTS_IDS.XYZ_WING]: t('hintsMenu.xyzWing', 'XYZ-Wing'),
        [HINTS_IDS.UNIQUE_RECTANGLE]: t('hintsMenu.uniqueRectangle', 'Unique\nRectangle'),
    }

    const HINTS_MENU_ITEMS = [
        { label: HINT_LABELS[HINTS_IDS.NAKED_SINGLE], id: HINTS_IDS.NAKED_SINGLE },
        { label: HINT_LABELS[HINTS_IDS.HIDDEN_SINGLE], id: HINTS_IDS.HIDDEN_SINGLE },
        { label: HINT_LABELS[HINTS_IDS.OMISSION], id: HINTS_IDS.OMISSION },
        { label: HINT_LABELS[HINTS_IDS.NAKED_DOUBLE], id: HINTS_IDS.NAKED_DOUBLE },
        { label: HINT_LABELS[HINTS_IDS.HIDDEN_DOUBLE], id: HINTS_IDS.HIDDEN_DOUBLE },
        { label: HINT_LABELS[HINTS_IDS.NAKED_TRIPPLE], id: HINTS_IDS.NAKED_TRIPPLE },
        { label: HINT_LABELS[HINTS_IDS.HIDDEN_TRIPPLE], id: HINTS_IDS.HIDDEN_TRIPPLE },
        { label: HINT_LABELS[HINTS_IDS.X_WING], id: HINTS_IDS.X_WING },
        { label: HINT_LABELS[HINTS_IDS.Y_WING], id: HINTS_IDS.Y_WING },
        { label: HINT_LABELS[HINTS_IDS.EMPTY_RECTANGLE], id: HINTS_IDS.EMPTY_RECTANGLE },
        { label: HINT_LABELS[HINTS_IDS.REMOTE_PAIRS], id: HINTS_IDS.REMOTE_PAIRS },
        { label: HINT_LABELS[HINTS_IDS.X_CHAIN], id: HINTS_IDS.X_CHAIN },
        { label: HINT_LABELS[HINTS_IDS.XY_CHAIN], id: HINTS_IDS.XY_CHAIN },
        { label: HINT_LABELS[HINTS_IDS.W_WING], id: HINTS_IDS.W_WING },
        { label: HINT_LABELS[HINTS_IDS.XYZ_WING], id: HINTS_IDS.XYZ_WING },
        { label: HINT_LABELS[HINTS_IDS.UNIQUE_RECTANGLE], id: HINTS_IDS.UNIQUE_RECTANGLE },
    ]

    useEffect(() => {
        if (_isEmpty(mainNumbers) || _isEmpty(notes)) return
        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: { mainNumbers, notes, dependencies },
        })
    }, [onAction, mainNumbers, notes])

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT, payload: { dependencies } })
        }
    }, [])

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
                smartHintsTranslationsTexts
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
