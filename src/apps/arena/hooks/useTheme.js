import { useContext } from 'react'

import ThemeContext from '@contexts/ThemeContext'

export const useThemeValues = () => {
    const { theme } = useContext(ThemeContext)
    return theme
}

export const useTheme = () => {
    const localThemeContainerValues = useContext(ThemeContext)
    const theme = useThemeValues()
    return {
        theme,
        ...localThemeContainerValues,
    }
}
