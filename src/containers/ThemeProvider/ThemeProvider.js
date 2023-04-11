import React, { useState, useMemo } from 'react'

import { useColorScheme } from 'react-native'

import PropTypes from 'prop-types'

import ThemeContext from '@contexts/ThemeContext'

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

ThemeProvider.propTypes = {
    children: PropTypes.element.isRequired,
}
