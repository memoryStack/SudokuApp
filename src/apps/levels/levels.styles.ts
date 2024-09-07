import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { HEADER_HORIZONTAL_MARGIN } from 'src/navigation/headerSection/headerSection.constants'

import { PAGE_PADDINGS, itemHorizontalMargin } from './levels.constants'

export const getStyles = () => {
    return StyleSheet.create({
        container: {
            paddingHorizontal: PAGE_PADDINGS
        },
        levelContainer: {
            marginHorizontal: itemHorizontalMargin
        },
        performanceContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginRight: HEADER_HORIZONTAL_MARGIN,
        },
        performanceText: { marginLeft: 4 }
    })
}
