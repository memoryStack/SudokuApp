import React from 'react'

import { View } from 'react-native'

import _get from 'lodash/src/utils/get'
import _map from 'lodash/src/utils/map'
import _isFunction from 'lodash/src/utils/isFunction'

import { Settings } from '../../apps/header/components/settings/settings'
import { Touchable, TouchableTypes } from '../../apps/components/Touchable'
import { LeftArrow } from '../../resources/svgIcons/leftArrow'
import { ShareIcon } from '../../resources/svgIcons/share'

import { getHeaderRightItems, getHeaderLeftItems, } from '../navigation.utils'
import { HEADER_ITEMS } from '../route.constants'

import { getHeaderItemPress } from './headerItemsPressHandlers'
import { HEADER_ICONS_TOUCHABLE_HIT_SLOP, ICON_DIMENSION, ICON_FILL } from './headerSection.constants'
import { styles } from './headerSection.styles'

const HEADER_ITEM_VS_ICON = {
    [HEADER_ITEMS.BACK]: LeftArrow,
    [HEADER_ITEMS.SETTINGS]: (props) => <Settings {...props} />,
    [HEADER_ITEMS.SHARE]: ShareIcon,
}

const renderIconBtn = ({
    Icon,
    onPress,
    ...rest
}) => {
    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            onPress={onPress}
            hitSlop={HEADER_ICONS_TOUCHABLE_HIT_SLOP}
        >
            <Icon {...rest} />
        </Touchable>
    )
}

const renderHeaderItem = ({ item, index, route, navigation }) => {
    const commonProps = {
        width: ICON_DIMENSION,
        height: ICON_DIMENSION,
        fill: ICON_FILL,
        onPress: getHeaderItemPress({ item, route, navigation }),
    }

    const IconRenderer = HEADER_ITEM_VS_ICON[item]

    return (
        <View style={{ marginLeft: index !== 0 ? 16 : 0 }}>
            {
                _isFunction(IconRenderer) ? IconRenderer({ ...commonProps, navigation, })
                    : renderIconBtn({
                        Icon: IconRenderer,
                        ...commonProps,
                    })
            }
        </View>
    )
}

const renderHeaderSectionItems = ({
    containerStyle,
    items,
    navigation,
    route,
}) => {
    return (
        <View style={containerStyle}>
            {
                _map(items, (item, index) => {
                    return renderHeaderItem({ item, index, route, navigation })
                })
            }
        </View>
    )
}

export const renderLeftHeader = ({ navigation, route }) => {
    return renderHeaderSectionItems({
        containerStyle: styles.leftHeaderContainer,
        items: getHeaderLeftItems(route),
        navigation,
        route,
    })
}

export const renderRightHeader = ({ navigation, route }) => {
    return renderHeaderSectionItems({
        containerStyle: styles.rightHeaderContainer,
        items: getHeaderRightItems(route),
        navigation,
        route,
    })
}