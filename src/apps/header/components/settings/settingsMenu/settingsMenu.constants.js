import _compact from '@lodash/compact'

export const ITEMS_KEYS = {
    HOW_TO_PLAY: 'HOW_TO_PLAY',
    SELECT_LANGUAGE: 'SELECT_LANGUAGE',
    DESIGN_SYSTEM: 'DESIGN_SYSTEM',
}

export const MENU_ITEMS = _compact([
    {
        key: ITEMS_KEYS.HOW_TO_PLAY,
        label: 'How to Play?',
    },
    {
        key: ITEMS_KEYS.SELECT_LANGUAGE,
        label: 'Language',
    },
    // TODO: it's just experimental, remove it later
    __DEV__ && {
        key: ITEMS_KEYS.DESIGN_SYSTEM,
        label: 'Design System',
    },
])

export const SETTINGS_MENU_TEST_ID = 'settings_menu'
