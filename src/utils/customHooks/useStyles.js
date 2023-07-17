import { useMemo } from 'react'

import { useBoardElementsDimensions } from '../../apps/arena/hooks/useBoardElementsDimensions'
import { useThemeValues } from '../../apps/arena/hooks/useTheme'

export const useStyles = (stylesHandler, customProps) => {
    const theme = useThemeValues()

    const boardElementsDimensions = useBoardElementsDimensions()

    const styles = useMemo(() => {
        const styleHandlerProps = {
            ...boardElementsDimensions,
            ...customProps,
        }

        return stylesHandler(styleHandlerProps, theme)
        // TODO: try to optimize it try spreading customProps inside this dependency array
        // else will have to use lot of useMemo in all the components to avoid styles generation
    }, [theme, boardElementsDimensions, customProps])
    return styles
}
