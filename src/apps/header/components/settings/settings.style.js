import { StyleSheet } from 'react-native'

import { fonts } from '../../../../resources/fonts/font'

export const styles = StyleSheet.create({
    menuContainer: {
        display: 'flex',
        borderRadius: 4,
        position: 'absolute',
        right: 8,
        top: 40,
        elevation: 10,
        backgroundColor: 'white',
        padding: 16,
    },
    menuText: {
        fontFamily: fonts.regular,
        fontSize: 16,
    },
    spaceBetweenMenuItems: {
        marginTop: 16,
    },
})
