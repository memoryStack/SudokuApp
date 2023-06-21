import React, { memo, useRef } from 'react'

import { View } from 'react-native'

import { SettingsIcon } from '@resources/svgIcons/settings'

import { useToggle } from '../../../../utils/customHooks'

import { Touchable } from '../../../components/Touchable'

import { SETTINGS_BUTTON_TEST_ID } from './settings.constants'

import SettingsMenu from './settingsMenu'

export const Settings_ = () => {
    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const iconRef = useRef(null)

    const renderIcon = () => (
        <Touchable
            onPress={toggleMenuVisibility}
            testID={SETTINGS_BUTTON_TEST_ID}
        >
            <View ref={iconRef} collapsable={false}>
                <SettingsIcon iconBoxSize={32} />
            </View>
        </Touchable>
    )

    return (
        <>
            {renderIcon()}
            <SettingsMenu
                open={openMenu}
                onClose={toggleMenuVisibility}
            />
        </>
    )
}

export const Settings = memo(Settings_)
