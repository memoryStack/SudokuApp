import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    page: {
        display: 'flex',
        paddingHorizontal: 16
    },
    categoryItemsContainer: {
        marginLeft: 16
    },
    categoryHeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {

    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemsGap: {
        marginTop: 8,
    },
    previewContainer: {
        marginTop: 16
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
    snackbarContainer: {
        left: 16,
        right: 16
    },
    snackbarText: {
        color: _get(theme, 'colors.inverse-on-surface'),
    }
})
