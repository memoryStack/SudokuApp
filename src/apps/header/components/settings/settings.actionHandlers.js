import LanguageSelector from 'src/apps/components/LanguageSelector'
import { ROUTES } from '../../../../navigation/route.constants'

import { ITEMS_KEYS } from './settings.constants'

const handleHowToPlayPress = ({ getState }) => {
    const { navigation } = getState()
    navigation.navigate(ROUTES.PLAY_GUIDE)
}

const handleLanguageSelectPress = ({ params }) => {
    const { modalContextValues: { showModal, hideModal } } = params

    showModal({
        Component: LanguageSelector,
        props: {
            hideModal,
        },
    })
}

const handleDesignSystemPress = ({ getState }) => {
    const { navigation } = getState()
    navigation.navigate(ROUTES.DESIGN_SYSTEM)
}

const ITEM_VS_PRESS_HANDLER = {
    [ITEMS_KEYS.HOW_TO_PLAY]: handleHowToPlayPress,
    [ITEMS_KEYS.SELECT_LANGUAGE]: handleLanguageSelectPress,
    [ITEMS_KEYS.DESIGN_SYSTEM]: handleDesignSystemPress,
}

const handleItemPress = ({ getState, setState, params }) => {
    const handler = ITEM_VS_PRESS_HANDLER[params.itemKey]

    if (handler) {
        handler({ getState, setState, params })
    }
}

export const ACTION_TYPES = {
    ON_ITEM_PRESS: 'ON_ITEM_PRESS',
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_ITEM_PRESS]: handleItemPress,
}
