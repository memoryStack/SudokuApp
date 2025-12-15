import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react'

import { useColorScheme, ColorSchemeName, Appearance } from 'react-native'

import PropTypes from 'prop-types'

import ThemeContext from '@contexts/ThemeContext'

import theme from '../../designSystem/tokens.json'
import darkTheme from '../../designSystem/tokens-dark.json'
import _isNil from '@lodash/isNil'
import DependencyContext from '@contexts/DependencyContext'
import { GAME_SETTINGS_KEYS } from '@interfaces/gameSettingsAdapter'

const COLOR_SCHEMES = {
    LIGHT: 'light',
    DARK: 'dark',
}

const ThemeProvider = ({ children }) => {
    const {
        state: { gameSettingsInitialized },
        gameSettingsAdapter
    } = useContext(DependencyContext)

    const deviceColorScheme = useColorScheme()

    const [colorScheme, setColorScheme] = useState(useColorScheme() ?? COLOR_SCHEMES.LIGHT)

    useEffect(() => {
        if (!_isNil(gameSettingsAdapter.isDarkMode())) {
            setColorScheme(gameSettingsAdapter.isDarkMode() ? COLOR_SCHEMES.DARK : COLOR_SCHEMES.LIGHT)
        } else {
            // save dark mode on/off in volatile state for gameSettings screen
            // dark mode toggle button to show correct state
            gameSettingsAdapter.updateGameSettingValueWithoutPersisting({
                key: GAME_SETTINGS_KEYS.DARK_MODE,
                value: deviceColorScheme === COLOR_SCHEMES.DARK
            })
        }
    }, [gameSettingsInitialized, gameSettingsAdapter])

    // TODO: test this on android 9 or less
    const switchTheme = useCallback(() => {
        const newTheme = colorScheme === COLOR_SCHEMES.DARK ? COLOR_SCHEMES.LIGHT : COLOR_SCHEMES.DARK
        setColorScheme(newTheme)
        Appearance.setColorScheme(newTheme)
    }, [colorScheme]);

    // TODO: we can remove isDarkColorScheme function if we pass that boolean from here only
    const contextValues = useMemo(() => {
        const isLight = colorScheme === COLOR_SCHEMES.LIGHT
        return {
            colorScheme,
            theme: isLight ? theme : darkTheme,
            isLight,
            switchTheme
        }
    }, [colorScheme, switchTheme])

    return (
        <ThemeContext.Provider value={contextValues}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider

ThemeProvider.propTypes = {
    children: PropTypes.element.isRequired,
}