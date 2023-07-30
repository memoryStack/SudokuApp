import { StyleSheet } from 'react-native'

export const getStyles = () => StyleSheet.create({
    backdrop: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // TODO: set this as scrim color and keep it consistent for all popups
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    untouchanbleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
