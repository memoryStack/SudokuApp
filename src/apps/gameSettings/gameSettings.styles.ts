import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { Theme } from 'src/containers/ThemeProvider'

export const getStyles = (_: any, theme: Theme) => StyleSheet.create({
    page: {
        display: 'flex',
        paddingHorizontal: 16
    },
    allCategoriesContainer: {
        paddingBottom: 40
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
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 16,
        borderRadius: 8,
        padding: 12,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: _get(theme, 'colors.outline-variant'),
    },
    refreeContainer: {
        paddingLeft: 0,
        marginBottom: 4,
        maxWidth: 312
    },
    boardControllerContainerStyles: {
        marginTop: 8,
        marginBottom: 8
    },
    boardControllerTextStyles: {
        marginTop: 2
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
    },
    tooltipContainer: {
        width: 250,
        left: -120
    },
    tooltipText: {
        color: 'white',
        padding: 8,
    }
})
