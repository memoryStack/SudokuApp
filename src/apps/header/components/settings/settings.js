import React, { memo } from 'react'

import { View } from 'react-native'
import { SettingsIcon } from '../../../../resources/svgIcons/settings'

import { useToggle } from '../../../../utils/customHooks'
import { consoleLog } from '../../../../utils/util'
import { Touchable, TouchableTypes } from '../../../components/Touchable'

export const Settings_ = ({ }) => {
    const [openMenu, toggleMenuVisibility] = useToggle(false)

    /* on opening, show menu */

    const renderIcon = () => {
        return (
            <Touchable
                touchable={TouchableTypes.opacity}
                onPress={toggleMenuVisibility}
            >
                <SettingsIcon iconBoxSize={40} />
            </Touchable>
        )
    }

    const renderMenu = () => {
        if (!openMenu) return null

        return (
            <View style={{
                width: 100,
                height: 100,
                backgroundColor: 'red'
            }} />
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
