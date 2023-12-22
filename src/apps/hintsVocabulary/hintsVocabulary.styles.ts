import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({ CELL_WIDTH }, theme) => StyleSheet.create({
    page: {
        display: 'flex',
        paddingHorizontal: 16,
    },
    notFoundText: {
        textAlign: 'center',
        marginTop: 200,
    },
})
