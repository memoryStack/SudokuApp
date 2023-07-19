import React, { useState, useMemo } from 'react'

import { useColorScheme } from 'react-native'

import PropTypes from 'prop-types'

import ThemeContext from '@contexts/ThemeContext'

import theme from '../../designSystem/tokens.json'

const ThemeProvider = ({ children }) => {
    const [userPreferredColorScheme, setUserPreferredColorScheme] = useState(null)

    const deviceColorScheme = useColorScheme()
    const colorScheme = userPreferredColorScheme || deviceColorScheme

    // TODO: we can remove isDarkColorScheme function if we pass that boolean from here only
    const contextValues = useMemo(() => ({
        colorScheme,
        setTheme: setUserPreferredColorScheme,
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
