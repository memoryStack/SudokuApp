import React from 'react'

import { View, useWindowDimensions, ViewPropTypes } from 'react-native'

import PropTypes from 'prop-types'

import { useStyles } from '@utils/customHooks/useStyles'

import _map from '@lodash/map'
import _isNil from '@lodash/isNil'
import _isEmpty from '@lodash/isEmpty'

import Text from '@ui/atoms/Text'
import Button, { BUTTON_TYPES } from '../Button'

import { getStyles } from './dialog.styles'

const Dialog = ({
    styles: stylesProp,
    title,
    description,
    body,
    footerButtonsConfig,
}) => {
    const { width: windowWidth } = useWindowDimensions()

    const isIconPresent = false

    const styles = useStyles(getStyles, { isIconPresent, windowWidth })

    const renderIcon = () => null

    const renderTitle = () => <Text style={styles.headline}>{title}</Text>

    const renderDescription = () => {
        if (_isEmpty(description)) return null
        return (<Text style={styles.description}>{description}</Text>)
    }

    // const renderDivider = () => (showDivider ? <Divider style={styles.divider} /> : null)

    const renderBody = () => {
        if (_isNil(body)) return null
        return React.cloneElement(body, {
            style: [styles.bodyContainer, body.props.style],
        })
    }

    const renderActionButtons = () => (
        <View style={styles.footerButtonsContainer}>
            {
                _map(footerButtonsConfig, ({ label, onClick }, index) => (
                    <Button
                        key={label}
                        type={BUTTON_TYPES.TEXT}
                        style={[styles.footerButton, index ? styles.footerButtonsGap : null]}
                        label={label}
                        onPress={onClick}
                    />
                ))
            }
        </View>
    )

    // TODO: think over the divider's uses
    return (
        <View style={[styles.container, stylesProp]}>
            {renderIcon()}
            {renderTitle()}
            {renderDescription()}
            {/* {renderDivider()} */}
            {renderBody()}
            {/* {renderDivider()} */}
            {renderActionButtons()}
        </View>
    )
}

export default React.memo(Dialog)

Dialog.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    // showDivider: PropTypes.bool,
    body: PropTypes.element,
    footerButtonsConfig: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    })),
    styles: ViewPropTypes.style,
}

Dialog.defaultProps = {
    title: '',
    description: '',
    // showDivider: false,
    body: null,
    footerButtonsConfig: [],
    styles: null,
}
