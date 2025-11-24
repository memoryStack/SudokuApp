import { useMemo } from 'react'

import _values from '@lodash/values'

import { useBoardElementsDimensions } from '../../apps/arena/hooks/useBoardElementsDimensions'
import { useTheme } from '../../apps/arena/hooks/useTheme'

export const useStyles = (stylesHandler, customProps, customWindowWidth) => {
    const { theme, isLight } = useTheme()

    const boardElementsDimensions = useBoardElementsDimensions(customWindowWidth)

    const styles = useMemo(() => {
        const styleHandlerProps = {
            ...boardElementsDimensions,
            ...customProps,
        }
        return stylesHandler(styleHandlerProps, theme, isLight)
    }, [stylesHandler, ..._values(customProps), theme, boardElementsDimensions, isLight])
    return styles
}
