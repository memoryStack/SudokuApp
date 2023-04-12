import { useMemo } from 'react'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import { useBoardElementsDimensions } from 'src/apps/arena/hooks/useBoardElementsDimensions'

export const useStyles = (stylesHandler, customProps) => {
    const theme = useThemeValues()

    const boardElementsDimensions = useBoardElementsDimensions()

    const styles = useMemo(() => {
        const styleHandlerProps = {
            ...boardElementsDimensions,
            ...customProps,
        }

        return stylesHandler(styleHandlerProps, theme)
    }, [theme, boardElementsDimensions, customProps])
    return styles
}
