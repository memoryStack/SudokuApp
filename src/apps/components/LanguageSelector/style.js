import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        marginHorizontal: 16,
        maxHeight: 500,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 4,
    },
    headerText: {
        marginBottom: 16, // TODO: add text styles here
    },
    languagesListContainer: {
        marginLeft: 16,
    },
    languageItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageLable: {
        marginLeft: 16,
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
})
