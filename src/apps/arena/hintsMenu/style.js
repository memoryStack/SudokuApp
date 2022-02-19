import { StyleSheet } from 'react-native'
import { fonts } from '../../../resources/fonts/font'

const BORDER_THICKNESS = 2
export const styles = StyleSheet.create({
    overlayContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    container: {
        height: '50%',
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 32,
        overflow: 'hidden',
    },
    menuItem: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        color: 'rgb(49, 90, 163)',
        fontSize: 20,
        fontFamily: fonts.regular,
    },
    menuRowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    horizontalSeperator: { width: '101%', height: BORDER_THICKNESS, backgroundColor: 'rgb(49, 90, 163)' },
    verticalSeperator: { width: BORDER_THICKNESS, height: '101%', backgroundColor: 'rgb(49, 90, 163)' },
})
