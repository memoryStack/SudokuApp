import { StyleSheet } from 'react-native'

import get from '@lodash/get'

export const getStyles = (_, theme) => StyleSheet.create({
    container: {
        maxHeight: 500,
    },
    headerText: {
        marginBottom: 16,
    },
    languagesListContainer: {
        marginLeft: 16,
        alignSelf: 'flex-start',
    },
    languageItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageItemsGap: {
        marginTop: 16,
    },
    languageLable: {
        marginLeft: 16,
        color: get(theme, ['colors', 'on-surface']),
    },
})
