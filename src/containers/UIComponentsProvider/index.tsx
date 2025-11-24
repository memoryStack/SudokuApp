import React from 'react'

import {
    MD3LightTheme as DefaultTheme,
    PaperProvider,
} from 'react-native-paper';

import { useThemeValues } from 'src/apps/arena/hooks/useTheme';

type Props = {
    children: React.ReactNode
}

const mapLocalColorsToUILibrary = (localTheme: any) => {
    return {
        primary: localTheme.colors.primary,
        onBackground: localTheme.colors['on-surface'],
        inverseSurface: localTheme.colors['inverse-surface'],
        inverseOnSurface: localTheme.colors['inverse-on-surface'],
    }
}

const UIComponentsProvider: React.FC<Props> = ({ children }) => {

    const localTheme = useThemeValues()

    const theme = {
        ...DefaultTheme,
        isV3: true,
        colors: {
            ...DefaultTheme.colors,
            ...mapLocalColorsToUILibrary(localTheme)
        },
    };

    return (
        <PaperProvider theme={theme}>
            {children}
        </PaperProvider>
    )
}

export default React.memo(UIComponentsProvider)
