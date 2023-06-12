import React, {
    memo, useRef,
} from 'react'

import { View, Text } from 'react-native'

import _map from '@lodash/map'

import { SettingsIcon } from '@resources/svgIcons/settings'

import withActions from '@utils/hocs/withActions'

import { useModal } from 'src/apps/arena/hooks/useModal'

import { useToggle } from '../../../../utils/customHooks'

import { Touchable, TouchableTypes } from '../../../components/Touchable'

import { ACTION_HANDLERS, ACTION_TYPES } from './settings.actionHandlers'
import { MENU_ITEMS, SETTINGS_BUTTON_TEST_ID, SETTINGS_MENU_TEST_ID } from './settings.constants'
import { styles } from './settings.style'

export const Settings_ = ({ onAction }) => {
    const modalContextValues = useModal()

    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const iconRef = useRef(null)

    const renderIcon = () => (
        <Touchable
            touchable={TouchableTypes.opacity}
            onPress={toggleMenuVisibility}
            testID={SETTINGS_BUTTON_TEST_ID}
        >
            <View ref={iconRef} collapsable={false}>
                <SettingsIcon iconBoxSize={32} />
            </View>
        </Touchable>
    )

    const onItemPress = ({ key }) => {
        onAction({
            type: ACTION_TYPES.ON_ITEM_PRESS,
            payload: { itemKey: key, modalContextValues },
        })
        toggleMenuVisibility()
    }

    const renderMenu = () => {
        if (!openMenu) return null

        return (
            <View style={styles.menuContainer} testID={SETTINGS_MENU_TEST_ID}>
                {_map(MENU_ITEMS, (item, index) => (
                    <Touchable
                        key={item.label}
                        touchable={TouchableTypes.opacity}
                        onPress={() => onItemPress(item)}
                        avoidDefaultStyles
                    >
                        <Text style={[styles.menuText, index ? styles.spaceBetweenMenuItems : null]}>
                            {item.label}
                        </Text>
                    </Touchable>
                ))}
            </View>
        )
    }

    return (
        <>
            {renderIcon()}
            {renderMenu()}
        </>
    )
}

export const Settings = memo(withActions({ actionHandlers: ACTION_HANDLERS })(Settings_))
