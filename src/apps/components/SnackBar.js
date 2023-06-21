import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { fonts } from '@resources/fonts/font'
import { CloseIcon } from '@resources/svgIcons/close'

import { Touchable } from './Touchable'

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 24,
        backgroundColor: 'black', // replace this after talking to designer
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
    },
    msgTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white', // need designer's input
        fontFamily: fonts.regular,
    },
    closeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: 'black',
    },
})

const SnackBar_ = ({ msg, customStyles, onClose }) => (
    <View style={[styles.container, customStyles]}>
        <Text style={styles.msgTextStyle}>{msg}</Text>
        <Touchable
            style={styles.closeButton}
            activeOpacity={1}
            onPress={onClose}
            addHitSlop
        >
            <CloseIcon height={10} width={10} fill="white" />
        </Touchable>
    </View>
)

export const SnackBar = React.memo(SnackBar_)

SnackBar_.propTypes = {
    msg: PropTypes.string,
    customStyles: PropTypes.object,
    onClose: PropTypes.func,
}

SnackBar_.defaultProps = {
    msg: '',
    customStyles: null,
    onClose: _noop,
}
