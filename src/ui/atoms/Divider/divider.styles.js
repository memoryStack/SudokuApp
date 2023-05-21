import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { roundToNearestPixel } from '@utils/util'

import { DIVIDER_TYPES } from './divider.constants'

export const getStyles = ({ type }, theme) => {
    const isHorizontal = type === DIVIDER_TYPES.HORIZONTAL
    const crossDirectionDimensionProperty = isHorizontal ? 'height' : 'width'
    const inDirectionDimensionProperty = isHorizontal ? 'width' : 'height'

    return StyleSheet.create({
        container: {
            [inDirectionDimensionProperty]: '100%',
            [crossDirectionDimensionProperty]: roundToNearestPixel(_get(theme, ['divider', 'thickness'])),
            backgroundColor: _get(theme, ['divider', 'color']),
        },
    })
}
