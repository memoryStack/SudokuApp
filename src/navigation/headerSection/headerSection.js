import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _map from '@lodash/map'
import _isFunction from '@lodash/isFunction'
import get from '@lodash/get'

import { LeftArrow } from '@resources/svgIcons/leftArrow'
import { ShareIcon } from '@resources/svgIcons/share'

import { useThemeValues } from '../../apps/arena/hooks/useTheme'
import { Settings } from '../../apps/header/components/settings/settings'
import { Touchable } from '../../apps/components/Touchable'

import { getHeaderRightItems, getHeaderLeftItems } from '../navigation.utils'

import { getHeaderItemPress } from './headerItemsPressHandlers'
import {
    ICON_DIMENSION,
    HEADER_ITEM_VS_TEST_ID,
    HEADER_ITEMS,
} from './headerSection.constants'
import { styles } from './headerSection.styles'

const HEADER_ITEM_VS_ICON = {
    [HEADER_ITEMS.BACK]: LeftArrow,
    [HEADER_ITEMS.SETTINGS]: props => <Settings {...props} />,
    [HEADER_ITEMS.SHARE]: ShareIcon,
}

const renderIconBtn = ({
    Icon, onPress, testID, ...rest
}) => (
    <Touchable
        testID={testID}
        onPress={onPress}
        addHitSlop
    >
        <Icon {...rest} />
    </Touchable>
)

const HeaderItem = ({
    item, index, route, navigation,
}) => {
    const theme = useThemeValues()

    const commonProps = {
        width: ICON_DIMENSION,
        height: ICON_DIMENSION,
        fill: get(theme, ['colors', 'on-surface-variant']),
        onPress: getHeaderItemPress({ item, route, navigation }),
    }

    const IconRenderer = HEADER_ITEM_VS_ICON[item]

    return (
        <View key={item} style={{ marginLeft: index !== 0 ? 16 : 0 }}>
            {_isFunction(IconRenderer)
                ? IconRenderer({ ...commonProps, navigation })
                : renderIconBtn({
                    Icon: IconRenderer,
                    testID: HEADER_ITEM_VS_TEST_ID[item],
                    ...commonProps,
                })}
        </View>
    )
}

HeaderItem.propTypes = {
    item: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    route: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
}

const renderHeaderSectionItems = ({
    containerStyle, items, navigation, route,
}) => (
    <View style={containerStyle}>
        {_map(items, (item, index) => (
            <HeaderItem
                item={item}
                index={index}
                route={route}
                navigation={navigation}
            />
        ))}
    </View>
)

export const renderLeftHeader = ({ navigation, route }) => renderHeaderSectionItems({
    containerStyle: styles.leftHeaderContainer,
    items: getHeaderLeftItems(route),
    navigation,
    route,
})

export const renderRightHeader = ({ navigation, route }) => renderHeaderSectionItems({
    containerStyle: styles.rightHeaderContainer,
    items: getHeaderRightItems(route),
    navigation,
    route,
})
