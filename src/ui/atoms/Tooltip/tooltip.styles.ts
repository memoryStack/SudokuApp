import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({ }, theme) => {
    return StyleSheet.create({
        container: {
            marginRight: 160,
        },
        backgroundColor: {
            backgroundColor: _get(theme, ['colors', 'inverse-surface'])
        },
        text: {
            lineHeight: 16,
            color: _get(theme, ['colors', 'inverse-on-surface'])
        }
    })
}
