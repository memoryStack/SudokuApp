import { StyleSheet, Dimensions } from 'react-native'
import { fonts } from '../../../resources/fonts/font'

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
        fontFamily: fonts.regular,
    },
    logicContainer: {
        flex: 1,
        width: '100%',
    },
    hintLogicText: {
        fontSize: 16,
        fontFamily: fonts.regular,
    },
})
