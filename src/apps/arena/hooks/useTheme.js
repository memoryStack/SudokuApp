import { useContext } from 'react'

import ThemeContext from '@contexts/ThemeContext'

import { useTheme as useNavigationTheme } from '@react-navigation/native'

export const useThemeValues = useNavigationTheme

export const useTheme = () => {
    const localThemeContainerValues = useContext(ThemeContext)
    const theme = useThemeValues()
    return {
        theme,
        ...localThemeContainerValues,
    }
}
