import React from 'react'

import { StyleSheet, View } from 'react-native'

import _get from 'lodash/src/utils/get'
import _map from 'lodash/src/utils/map'

import { Settings } from '../apps/header/components/settings/settings'
import { Touchable, TouchableTypes } from '../apps/components/Touchable'
import { LeftArrow } from '../resources/svgIcons/leftArrow'

import { getHeaderRightItems, getRouteNameFromRoute, isHomeRoute } from './navigation.utils'

import { routesHeaderItems } from "./routes"


// TODO: this route can have multiple arrays in it
// search for it on internet

const HEADER_ICONS_TOUCHABLE_HIT_SLOP = { top: 16, right: 16, bottom: 16, left: 16 }

const HEADER_HORIZONTAL_MARGIN = 8

const styles = StyleSheet.create({
    rightHeaderContainer: {
        display: 'flex',
        alignItems: 'center',
        marginRight: HEADER_HORIZONTAL_MARGIN
    },
})

const renderLeftHeader = (navigation) => {
    // if (isHomeRoute(route)) return null

    const handleBackPress = () => {
        navigation && navigation.goBack()
    }

    // render back button here for all pages
    return (
        <Touchable
            touchable={TouchableTypes.opacity}
            onPress={handleBackPress}
            hitSlop={HEADER_ICONS_TOUCHABLE_HIT_SLOP}
            style={{
                marginLeft: HEADER_HORIZONTAL_MARGIN
            }}
        >
            {/* TODO: explore abnout standardising these constants for each icon */}
            <LeftArrow width={32} height={32} fill={'rgba(0, 0, 0, .8)'} />
        </Touchable>
    )
}

const renderHeaderItem = ({ item, index, navigation }) => {
    // always return settings icon
    return (
        <View style={{ marginLeft: index !== 0 ? 16 : 0 }}>
            <Settings navigation={navigation} />
        </View>
    )
}

const renderRightHeader = (navigation, route) => {

    const items = getHeaderRightItems(route)

    // render all items one by one

    return (
        <View style={styles.rightHeaderContainer}>
            {
                _map(items, (item, index) => {
                    return renderHeaderItem({ item, index, navigation })
                })
            }
        </View>
    )

}

export const getNavigationOptions = ({ navigation, route }) => {

    // return some header styles like paddings n all
    return {
        headerLeft: () => renderLeftHeader(navigation, route),
        headerRight: () => renderRightHeader(navigation, route),
        headerTransparent: true,
        title: '',
    }
}
