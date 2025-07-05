import React, { memo } from 'react'

import { useToggle } from '../../../../utils/customHooks'

import SettingsMenu from './settingsMenu'

export const Settings_ = () => {
    const [openMenu, toggleMenuVisibility] = useToggle(false)

    return (
        <SettingsMenu
            open={openMenu}
            onClose={toggleMenuVisibility}
        />
    )
}

export const Settings = memo(Settings_)
