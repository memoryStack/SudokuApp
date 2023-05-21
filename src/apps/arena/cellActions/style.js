import { StyleSheet } from 'react-native'
import { fonts } from '@resources/fonts/font'

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
        left: ACTION_CONTAINER_WIDTH / 2,
    },
})
