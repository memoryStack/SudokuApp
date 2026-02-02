import _compact from '@lodash/compact'

export const ITEMS_KEYS = {
    HOW_TO_PLAY: 'HOW_TO_PLAY',
    SELECT_LANGUAGE: 'SELECT_LANGUAGE',
    DESIGN_SYSTEM: 'DESIGN_SYSTEM',
    CHOOSE_EXPERIENCE: 'CHOOSE_EXPERIENCE',
}

export const MENU_ITEMS = _compact([
    {
        key: ITEMS_KEYS.HOW_TO_PLAY,
        label: 'How to Play?',
    },
    __DEV__ && {
        key: ITEMS_KEYS.SELECT_LANGUAGE,
        label: 'Language',
    },
    {
        key: ITEMS_KEYS.CHOOSE_EXPERIENCE,
        label: 'Customize Experience',
    },
    __DEV__ && {
        key: ITEMS_KEYS.DESIGN_SYSTEM,
        label: 'Design System',
    },
])

export const SETTINGS_MENU_TEST_ID = 'settings_menu'
export const SETTINGS_TOOLTIP_MESSAGE_TEST_ID = 'settings_tooltip_message'
