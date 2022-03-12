import { StyleSheet } from 'react-native'
import { fonts } from '../../../resources/fonts/font'

const FOOTER_HEIGHT = 24
export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    hintTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    hintsCountText: { marginLeft: 8, fontSize: 20 },
    footerContainer: {
        flexDirection: 'row',
        height: FOOTER_HEIGHT,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    footerButtonText: { color: '#4088da' },
})

export const getContainerStyles = (windowHeight, displayFooter) => {
    return {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'white',
        padding: 16,
        height: windowHeight / 4 + (displayFooter ? FOOTER_HEIGHT : 0),
    }
}
