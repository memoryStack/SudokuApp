import _get from 'lodash/src/utils/get'
import _noop from 'lodash/src/utils/noop'

import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from "../route.constants"

const handleBackPress = ({ navigation }) => {
    return () => navigation && navigation.goBack()
}

const handlePress = (route, pressHandlerKey) => {
    return _get(route, ['params', pressHandlerKey], _noop)()
}

const handlerSettingsPress = ({ route }) => {
    return () => handlePress(route, HEADER_ITEMS_PRESS_HANDLERS_KEYS.SETTINGS)
}

const handlerSharePress = ({ route }) => {
    return () => handlePress(route, HEADER_ITEMS_PRESS_HANDLERS_KEYS.SHARE)
}

const HEADER_ITEM_VS_PRESS_HANDLER = {
    [HEADER_ITEMS.BACK]: handleBackPress,
    [HEADER_ITEMS.SETTINGS]: handlerSettingsPress,
    [HEADER_ITEMS.SHARE]: handlerSharePress,
}

export const getHeaderItemPress = ({ item, route, navigation }) => {
    return _get(HEADER_ITEM_VS_PRESS_HANDLER, item, _noop)({ route, navigation }) || _noop
}
