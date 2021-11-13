import { StyleSheet, Dimensions } from 'react-native'

const windowHeight = Dimensions.get('window').height
export const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'white',
        padding: 16,
        height: windowHeight / 4,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    hintTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    logicContainer: {
        flex: 1,
        width: '100%',
    },
    hintLogicText: {
        fontSize: 16,
    },
})
