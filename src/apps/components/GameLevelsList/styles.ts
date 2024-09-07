import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { PAGE_PADDINGS, itemHorizontalMargin } from './constants'

export const getStyles = () => {
    return StyleSheet.create({
        container: {
            paddingHorizontal: PAGE_PADDINGS
        },
        levelContainer: {
            marginHorizontal: itemHorizontalMargin
        },
    })
}
