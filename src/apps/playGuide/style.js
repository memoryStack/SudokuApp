import { StyleSheet } from 'react-native'

import { fonts } from '../../resources/fonts/font'

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 60,
    },
    heading: {
        fontSize: 24,
        fontFamily: fonts.bold,
        marginTop: 24,
        marginBottom: 40,
    },
    ruleText: {
        fontSize: 18,
        padding: 20,
        lineHeight: 24,
    },
    axisText: {
        color: 'black',
    },
})