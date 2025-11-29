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
        color: _get(theme, 'colors.on-surface'),
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
        marginTop: 16,
        borderRadius: 8,
        padding: 12,
        paddingBottom: 16,
        borderWidth: 1,
        borderColor: _get(theme, 'colors.outline-variant'),
    },
    refreeContainer: {
        marginLeft: 0,
        marginBottom: 4,
        maxWidth: 312
    },
    boardControllerContainerStyles: {
        marginTop: 0
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 8,
    },
    boardControllerTextStyles: {
        marginTop: 2
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemDescription: {
        color: _get(theme, 'colors.on-surface'),
    },
    divider: {
        marginVertical: 16,
    },
    snackbarContainer: {
        left: 16,
        right: 16,
    },
    snackbarText: {
        color: _get(theme, 'colors.inverse-on-surface'),
    },
    tooltipContainer: {
        width: 250,
        left: -120
    },
    tooltipText: {
        padding: 8,
    }
})
