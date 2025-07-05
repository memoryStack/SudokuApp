import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = () => StyleSheet.create({
    page: {
        display: 'flex',
        paddingHorizontal: 16
    },
    categoryItemsContainer: {
        marginLeft: 16
    },
    categoryTitle: {
        marginBottom: 12,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemsGap: {
        marginTop: 8,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemDescription: {
    },
    divider: {
        marginVertical: 16,
    },
})
