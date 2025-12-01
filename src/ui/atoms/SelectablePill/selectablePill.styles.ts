import { StyleSheet } from 'react-native'
import _get from '@lodash/get'

export const getStyles = ({ selected }: { selected: boolean }, theme: unknown) => {
    const selectedBgColor = _get(theme, ['colors', 'secondary-container'])
    const unselectedBgColor = _get(theme, ['colors', 'surface-container-high'])
    const selectedTextColor = _get(theme, ['colors', 'on-secondary-container'])
    const unselectedTextColor = _get(theme, ['colors', 'on-surface-variant'])
    const outlineColor = _get(theme, ['colors', 'outline'])

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: selected ? selectedBgColor : unselectedBgColor,
            borderWidth: 1,
            borderColor: selected ? outlineColor : 'transparent',
        },
        text: {
            color: selected ? selectedTextColor : unselectedTextColor,
        },
        checkIcon: {
            marginRight: 8,
        },
    })
}

