import React, {
    memo, useEffect, useRef,
} from 'react'

import { View, Text } from 'react-native'

import _map from '@lodash/map'

import { TouchableOpacity } from 'react-native-gesture-handler'

import withActions from '@utils/hocs/withActions'
import { useModal } from 'src/apps/arena/hooks/useModal'
import { SettingsIcon } from '../../../../resources/svgIcons/settings'
import { useToggle } from '../../../../utils/customHooks'
import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../../../navigation/route.constants'

import { Touchable, TouchableTypes } from '../../../components/Touchable'

import { MENU_ITEMS } from './settings.config'

import { ACTION_HANDLERS, ACTION_TYPES } from './settings.actionHandlers'
import { styles } from './settings.style'

export const Settings_ = ({ navigation, onPress, onAction }) => {
    const modalContextValues = useModal()

    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const iconRef = useRef(null)

    useEffect(() => {
        navigation.setParams({
            [HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.SETTINGS]]: toggleMenuVisibility,
        })
    }, [navigation])

    const renderIcon = () => (
        <Touchable touchable={TouchableTypes.opacity} onPress={onPress}>
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
            <View style={styles.menuContainer}>
                {_map(MENU_ITEMS, (item, index) => (
                    <TouchableOpacity
                        touchable={TouchableTypes.withoutFeedBack}
                        onPress={() => onItemPress(item)}
                    >
                        <Text style={[styles.menuText, index ? styles.spaceBetweenMenuItems : null]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
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
