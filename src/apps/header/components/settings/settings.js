import React, { memo, useRef } from 'react'

import { View, StyleSheet } from 'react-native'

import get from '@lodash/get'

import { SettingsIcon } from '@resources/svgIcons/settings'

import { useStyles } from '@utils/customHooks/useStyles'

import { useToggle } from '../../../../utils/customHooks'

import { Touchable } from '../../../components/Touchable'

import SettingsMenu from './settingsMenu'
import { SETTINGS_BUTTON_TEST_ID } from './settings.constants'

const getStyles = (_, theme) => StyleSheet.create({
    icon: {
        color: get(theme, ['colors', 'on-surface-variant']),
    },
})

export const Settings_ = () => {
    const styles = useStyles(getStyles)

    const [openMenu, toggleMenuVisibility] = useToggle(false)

    const iconRef = useRef(null)

    const renderIcon = () => (
        <Touchable
            onPress={toggleMenuVisibility}
            testID={SETTINGS_BUTTON_TEST_ID}
        >
            <View ref={iconRef} collapsable={false}>
                <SettingsIcon iconBoxSize={32} fill={styles.icon.color} />
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
