import { StyleSheet } from 'react-native'

import get from '@lodash/get'

import { NEXT_GAME_MENU_ROW_HEIGHT } from './nextGameMenu.constants'

export const getStyles = (_, theme) => StyleSheet.create({
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
        color: get(theme, ['colors', 'on-surface']),
    },
    levelIcon: {
        color: get(theme, ['colors', 'on-surface']),
    },
})
