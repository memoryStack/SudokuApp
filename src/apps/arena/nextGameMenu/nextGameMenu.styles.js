import { StyleSheet } from 'react-native'

import { NEXT_GAME_MENU_ROW_HEIGHT } from './nextGameMenu.constants'

export const styles = StyleSheet.create({
    nextGameMenuContainer: {
        width: '100%',
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: NEXT_GAME_MENU_ROW_HEIGHT,
        paddingHorizontal: 16,
    },
    levelText: {
        marginLeft: 16,
    },
})
