import React, { memo, useEffect, useState } from 'react'

import { View } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { Menu } from 'react-native-paper';

import PropTypes from 'prop-types'

import _map from '@lodash/map'
import _noop from '@lodash/noop'
import _get from '@lodash/get';
import _isNil from '@lodash/isNil';

import Text from '@ui/atoms/Text'
import Tooltip, { usePopable } from '@ui/atoms/Tooltip'

import withActions from '@utils/hocs/withActions'
import { useStyles } from '@utils/customHooks/useStyles'
import { useToggle } from '@utils/customHooks';
import { SettingsIcon } from '@resources/svgIcons/settings';

import { useTranslation } from '../../../../../i18n/hooks/useTranslation'

import { useModal } from '../../../../arena/hooks/useModal'
import { Touchable } from '../../../../components/Touchable'

import { ACTION_HANDLERS, ACTION_TYPES } from './settingsMenu.actionHandlers'
import { ITEMS_KEYS, SETTINGS_MENU_TEST_ID } from './settingsMenu.constants'
import { getStyles } from './settingsMenu.style'
import { SETTINGS_BUTTON_TEST_ID } from '../settings.constants';
import { NAV_PARAMS } from 'src/navigation/headerSection/headerSection.constants';

export const SettingsMenu_ = ({ onAction }) => {
    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const styles = useStyles(getStyles)
    const { t } = useTranslation('settings')

    const [tooltip, setTooltip] = useState({
        show: false,
        message: ''
    })

    const { ref: tooltipRef, hide, show } = usePopable()

    const navigation = useNavigation()
    const modalContextValues = useModal()

    const route = useRoute()

    useEffect(() => {
        const tooltip = _get(route, ['params', NAV_PARAMS.SETTINGS_TOOLTIP])
        if (_isNil(tooltip)) return
        setTooltip(tooltip)
        if (tooltip.show) show()
        else hide()
    }, [route?.params?.[NAV_PARAMS.SETTINGS_TOOLTIP]])

    const onItemPress = ({ key }) => {
        onAction({
            type: ACTION_TYPES.ON_ITEM_PRESS,
            payload: { itemKey: key, modalContextValues, navigation },
        })
        toggleMenuVisibility()
    }

    const renderIcon = () => (
        <Tooltip
            ref={tooltipRef}
            content={
                <Text
                    style={styles.tooltipText}
                    withoutLineHeight
                >
                    {tooltip.message}
                </Text>
            }
            position={"bottom"}
            caretPosition={"right"}
            containerStyle={styles.tooltipContainer}
        >
            <Touchable
                onPress={() => {
                    toggleMenuVisibility()
                    hide()
                }}
                testID={SETTINGS_BUTTON_TEST_ID}
            >
                <SettingsIcon iconBoxSize={32} fill={styles.icon.color} />
            </Touchable>
        </Tooltip>
    )

    const MENU_ITEMS = [
        {
            key: ITEMS_KEYS.HOW_TO_PLAY,
            label: t('menu.howToPlay', 'How to Play?'),
        },
        __DEV__ && {
            key: ITEMS_KEYS.SELECT_LANGUAGE,
            label: t('menu.language', 'Language'),
        },
        {
            key: ITEMS_KEYS.CHOOSE_EXPERIENCE,
            label: t('menu.customizeExperience', 'Customize Experience'),
        },
        __DEV__ && {
            key: ITEMS_KEYS.DESIGN_SYSTEM,
            label: t('menu.designSystem', 'Design System'),
        },
    ].filter(Boolean)

    return (
        <Menu
            visible={openMenu}
            onDismiss={toggleMenuVisibility}
            anchor={renderIcon()}
            contentStyle={styles.menuContainer}
        >
            <View testID={SETTINGS_MENU_TEST_ID}>
                {_map(MENU_ITEMS, item => (
                    <Touchable
                        key={item.label}
                        onPress={() => onItemPress(item)}
                        avoidDefaultStyles
                    >
                        <View style={styles.menuItemContainer}>
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </View>
                    </Touchable>
                ))}
            </View>
        </Menu>
    )
}

export default memo(withActions({ actionHandlers: ACTION_HANDLERS })(SettingsMenu_))

SettingsMenu_.propTypes = {
    onAction: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

SettingsMenu_.defaultProps = {
    onAction: _noop,
    open: false,
    onClose: _noop,
}
