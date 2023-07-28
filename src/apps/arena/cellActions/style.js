import { StyleSheet } from 'react-native'

export const INACTIVE_ICON_FILL = 'rgb(127, 127, 127)'
export const styles = StyleSheet.create({
    actionContainer: {
        display: 'flex',
        alignItems: 'center',

    },
    actionText: {
        marginTop: 8,
        color: INACTIVE_ICON_FILL, // to match the icon color and below text color
    },
})
