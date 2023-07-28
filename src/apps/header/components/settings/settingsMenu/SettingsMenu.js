import React, { memo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _map from '@lodash/map'
import _noop from '@lodash/noop'

import withActions from '@utils/hocs/withActions'

import { useNavigation } from '@react-navigation/native'

import Text from '@ui/atoms/Text'

import { useModal } from '../../../../arena/hooks/useModal'
import { Touchable } from '../../../../components/Touchable'

import { ACTION_HANDLERS, ACTION_TYPES } from './settingsMenu.actionHandlers'
import { MENU_ITEMS, SETTINGS_MENU_TEST_ID } from './settingsMenu.constants'
import { styles } from './settingsMenu.style'

export const SettingsMenu_ = ({ onAction, open, onClose }) => {
    const navigation = useNavigation()
    const modalContextValues = useModal()

    const onItemPress = ({ key }) => {
        onAction({
            type: ACTION_TYPES.ON_ITEM_PRESS,
            payload: { itemKey: key, modalContextValues, navigation },
        })
        onClose()
    }

    if (!open) return null

    return (
        <View style={styles.menuContainer} testID={SETTINGS_MENU_TEST_ID}>
            {_map(MENU_ITEMS, (item, index) => (
                <Touchable
                    key={item.label}
                    onPress={() => onItemPress(item)}
                    avoidDefaultStyles
                >
                    <Text style={index ? styles.spaceBetweenMenuItems : null}>
                        {item.label}
                    </Text>
                </Touchable>
            ))}
        </View>
    )
}

export default memo(withActions({ actionHandlers: ACTION_HANDLERS })(SettingsMenu_))

SettingsMenu_.propTypes = {
    onAction: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

SettingsMenu_.defaultProps = {
    onAction: _noop,
    open: false,
    onClose: _noop,
}
