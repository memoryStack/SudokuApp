import { StyleSheet } from 'react-native'

export const getStyles = () => {
    return StyleSheet.create({
        starsContainer: {
            display: 'flex',
            flexDirection: 'row',
        },
        middleStar: {
            position: 'relative',
        }
    })
}
