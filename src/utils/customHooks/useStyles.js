import { useMemo } from 'react'

import _values from '@lodash/values'

import { useBoardElementsDimensions } from '../../apps/arena/hooks/useBoardElementsDimensions'
import { useThemeValues } from '../../apps/arena/hooks/useTheme'

export const useStyles = (stylesHandler, customProps, customWindowWidth) => {
    const theme = useThemeValues()

    const boardElementsDimensions = useBoardElementsDimensions(customWindowWidth)

    const styles = useMemo(() => {
        const styleHandlerProps = {
            ...boardElementsDimensions,
            ...customProps,
        }
        return stylesHandler(styleHandlerProps, theme)
    }, [stylesHandler, ..._values(customProps), theme, boardElementsDimensions])
    return styles
}
