import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { hexToRGBA } from '@utils/util'

export const getStyles = ({ isSelected, disabled }, theme) => {
    let color = _get(theme, 'radioButton.default.color')
    if (isSelected) {
        color = _get(theme, 'radioButton.selected.color')
    }
    if (disabled) {
        const { color: _color, opacity } = _get(theme, 'radioButton.disabled')
        color = hexToRGBA(_color, opacity)
    }

    return StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            height: _get(theme, 'radioButton.outerRing.size'),
            width: _get(theme, 'radioButton.outerRing.size'),
            ..._get(theme, 'radioButton.outerRing.shape'),
            borderWidth: _get(theme, 'radioButton.outerRing.borderWidth'),
            borderColor: color,
        },
        innerDot: {
            height: _get(theme, 'radioButton.innerDot.size'),
            width: _get(theme, 'radioButton.innerDot.size'),
            ..._get(theme, 'radioButton.innerDot.shape'),
            backgroundColor: color,
        },
    })
}
