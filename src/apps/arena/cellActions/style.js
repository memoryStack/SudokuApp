import { StyleSheet } from 'react-native'
import { fonts } from '../../../resources/fonts/font'

const ACTION_CONTAINER_WIDTH = 60 // there are only 4 type of actions present
export const INACTIVE_ICON_FILL = 'rgb(127, 127, 127)'
export const Styles = StyleSheet.create({
    actionContainer: {
        display: 'flex',
        alignItems: 'center',
        width: ACTION_CONTAINER_WIDTH,
    },
    actionText: {
        fontSize: 16,
        marginTop: 8,
        fontFamily: fonts.regular,
        color: INACTIVE_ICON_FILL, // to match the icon color and below text color
    },
    hintsTickerBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -4,
        left: ACTION_CONTAINER_WIDTH / 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgb(49, 90, 163)',
    },
    hintsTickerText: {
        fontSize: 12,
        color: 'white',
        fontFamily: fonts.regular,
    },
})
