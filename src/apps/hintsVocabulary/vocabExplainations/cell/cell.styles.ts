import { StyleSheet } from 'react-native'

export const getStyles = () => StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    exampleBoardContainer: {
        marginTop: 24,
        marginBottom: 8,
        marginLeft: -6, // because the Board is taking a lot of space (96% of the screen width)
        alignSelf: 'center',
    },
})
