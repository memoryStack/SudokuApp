import React, { useState, useMemo } from 'react'

import { useColorScheme } from 'react-native'

import PropTypes from 'prop-types'

import ThemeContext from '@contexts/ThemeContext'

import theme from '../../designSystem/tokens.json'

const ThemeProvider = ({ children }) => {
    // TODO: here colorScheme and theme are getting mixed
    // search on the defination of these two words
    const [userPreferredTheme, setUserPreferredTheme] = useState(null)

    const deviceColorScheme = useColorScheme()
    const colorScheme = userPreferredTheme || deviceColorScheme

    // TODO: we can remove isDarkTheme function if we pass that boolean from here only
    const contextValues = useMemo(() => ({
        colorScheme,
        setTheme: setUserPreferredTheme,
        theme,
    }), [colorScheme])

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
