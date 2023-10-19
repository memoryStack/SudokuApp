import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    page: {
        display: 'flex',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
    },
    gameOverCardAbsoluteBG: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    gameOverAnimatedBG: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, .8)',
    },
    inputPanelContainer: {
        width: '100%',
        marginVertical: 20,
    },
})
