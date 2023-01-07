import React, { memo, useCallback, useEffect, useRef } from 'react'

import { View, Text } from 'react-native'

import _map from 'lodash/src/utils/map'

import { SettingsIcon } from '../../../../resources/svgIcons/settings'
import { useToggle } from '../../../../utils/customHooks'

import { Touchable, TouchableTypes } from '../../../components/Touchable'

import { TouchableOpacity } from 'react-native-gesture-handler'

import { MENU_ITEMS } from './settings.config'
import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../../../navigation/route.constants'

export const Settings_ = ({ navigation, onPress }) => {
    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const iconRef = useRef(null)

    useEffect(() => {
        navigation.setParams({
            [HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.SETTINGS]]: toggleMenuVisibility,
        })
    }, [])

    const renderIcon = () => {
        return (
            <Touchable touchable={TouchableTypes.opacity} onPress={onPress}>
                <View ref={iconRef} collapsable={false}>
                    <SettingsIcon iconBoxSize={32} />
                </View>
            </Touchable>
        )
    }

    const onItemPress = routeKey => {
        navigation.navigate(routeKey)
    }

    const renderMenu = () => {
        if (!openMenu) return null

        return (
            <View
                style={{
                    display: 'flex',
                    borderWidth: 2,
                    borderColor: 'black',
                    position: 'absolute',
                    right: 8,
                    top: 40,
                }}
            >
                {_map(MENU_ITEMS, ({ label, routeKey }) => {
                    return (
                        <TouchableOpacity
                            touchable={TouchableTypes.withoutFeedBack}
                            onPress={() => onItemPress(routeKey)}
                        >
                            <Text style={{ padding: 20 }}>{label}</Text>
                        </TouchableOpacity>
                    )
                })}
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

export const Settings = memo(Settings_)
