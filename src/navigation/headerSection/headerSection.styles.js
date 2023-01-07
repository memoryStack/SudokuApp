import { StyleSheet } from 'react-native'

import { HEADER_HORIZONTAL_MARGIN } from './headerSection.constants'

export const styles = StyleSheet.create({
    leftHeaderContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: HEADER_HORIZONTAL_MARGIN,
    },
    rightHeaderContainer: {
        display: 'flex',
        alignItems: 'center',
        marginRight: HEADER_HORIZONTAL_MARGIN,
    },
})