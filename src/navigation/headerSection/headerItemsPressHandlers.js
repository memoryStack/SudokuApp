import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from './headerSection.constants'

const handlePress = (route, pressHandlerKey) => _get(route, ['params', pressHandlerKey], _noop)()

const handleBackPress = ({ navigation, route }) => () => _get(route, ['params', HEADER_ITEMS_PRESS_HANDLERS_KEYS.BACK], (navigation?.goBack || _noop))()

const handlerSettingsPress = ({ route }) => () => handlePress(route, HEADER_ITEMS_PRESS_HANDLERS_KEYS.SETTINGS)

const handlerSharePress = ({ route }) => () => handlePress(route, HEADER_ITEMS_PRESS_HANDLERS_KEYS.SHARE)

const HEADER_ITEM_VS_PRESS_HANDLER = {
    [HEADER_ITEMS.BACK]: handleBackPress,
    [HEADER_ITEMS.SETTINGS]: handlerSettingsPress,
    [HEADER_ITEMS.SHARE]: handlerSharePress,
}

export const getHeaderItemPress = ({ item, route, navigation }) => _get(HEADER_ITEM_VS_PRESS_HANDLER, item, _noop)({ route, navigation }) || _noop
