import { renderLeftHeader, renderRightHeader } from './headerSection/headerSection'

import { getRouteHeaderTitle } from './navigation.utils'

export const getNavigationOptions = ({ navigation, route }) => ({
    headerLeft: () => renderLeftHeader({ navigation, route }),
    headerRight: () => renderRightHeader({ navigation, route }),
    title: getRouteHeaderTitle(route),
})
