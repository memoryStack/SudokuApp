import React, { useState, useMemo } from 'react'

import PropTypes from 'prop-types'

// TODO: add import aliases for contexts
import ThemeContext from 'src/contexts/ThemeContext'

import { useColorScheme } from 'react-native'

const THEME_TYPES = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
}

// TODO: search on how to use the variables of a class which are very
// local to that, should i define these as static or should these be out
// of the call ??

export class Theme {
    static themes = {
        LIGHT: 'light',
        DARK: 'dark',
    }

    // TODO: this handler will be used in
    // only 1 place, in NavigationProvider
    static isDarkTheme(theme) {
        return this.themes.DARK === theme
    }
}

const ThemeProvider = ({ children }) => {
    const [userPreferredTheme, setUserPreferredTheme] = useState(null)

    const deviceColorScheme = useColorScheme()
    const colorScheme = userPreferredTheme || deviceColorScheme

    const contextValues = useMemo(() => ({
        colorScheme,
        setTheme: setUserPreferredTheme,
    }), [colorScheme])

    return (
        <ThemeContext.Provider value={contextValues}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider

export { THEME_TYPES }

ThemeProvider.propTypes = {
    children: PropTypes.element.isRequired,
}
