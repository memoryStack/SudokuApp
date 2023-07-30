import React from 'react'

import { View, ViewPropTypes } from 'react-native'

import PropTypes from 'prop-types'

import { styles } from './stopTouchPropagation.styles'

const StopTouchPropagation = ({ children, style: styleProp, ...rest }) => (
    <View
        onStartShouldSetResponder={() => true}
        onTouchEnd={e => e.stopPropagation()}
        style={[styles.container, styleProp]}
        {...rest}
    >
        {children}
    </View>
)

export default React.memo(StopTouchPropagation)

StopTouchPropagation.propTypes = {
    children: PropTypes.element.isRequired,
    style: ViewPropTypes.style,
}

StopTouchPropagation.defaultProps = {
    style: null,
}
