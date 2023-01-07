import { renderLeftHeader, renderRightHeader } from './headerSection/headerSection'

export const getNavigationOptions = ({ navigation, route }) => {
    return {
        headerLeft: () => renderLeftHeader({ navigation, route }),
        headerRight: () => renderRightHeader({ navigation, route }),
        headerTransparent: true,
        title: '',
    }
}
