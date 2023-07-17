import React, {
    useRef, useCallback, useEffect, useState,
} from 'react'
import { View, Text, StyleSheet } from 'react-native'

import _isEmpty from '@lodash/isEmpty'

import { fonts } from '@resources/fonts/font'
import { CloseIcon } from '@resources/svgIcons/close'

import { addListener, removeListener } from '@utils/GlobalEventBus'

import { EVENTS } from '../../constants/events'

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

const SnackBar_ = () => {
    const [snackBar, setSnackBar] = useState({
        show: false, view: null, msg: '', customStyles: null,
    })
    const snackBarTimerID = useRef(null)
    // added pretty raw implementation for snackbars right now
    // later on after finalizing a robust implementation i can make
    // an HOC so that tis snackbar can be re-used for each view

    const hideSnackBar = () => {
        setSnackBar({
            show: false, view: null, msg: '', customStyles: null,
        })
    }

    const clearTimer = () => {
        snackBarTimerID.current && clearTimeout(snackBarTimerID.current)
    }

    useEffect(() => {
        const handler = ({
            snackbarView = null, msg = '', visibleTime = 3000, customStyles = null,
        }) => {
            if (_isEmpty(snackbarView) && _isEmpty(msg)) return

            setSnackBar({
                show: true, view: snackbarView, msg, customStyles,
            })
            snackBarTimerID.current = setTimeout(hideSnackBar, visibleTime)
        }
        addListener(EVENTS.LOCAL.SHOW_SNACK_BAR, handler)

        return () => {
            removeListener(EVENTS.LOCAL.SHOW_SNACK_BAR, handler)
            clearTimer()
        }
    }, [])

    const onCloseSnackBar = useCallback(() => {
        clearTimer()
        hideSnackBar()
    }, [])

    if (!snackBar.show) return null
    if (snackBar.view) return snackBar.view

    return (
        <View style={[styles.container, snackBar.customStyles]}>
            <Text style={styles.msgTextStyle}>{snackBar.msg}</Text>
            <Touchable
                style={styles.closeButton}
                activeOpacity={1}
                onPress={onCloseSnackBar}
                addHitSlop
            >
                <CloseIcon height={10} width={10} fill="white" />
            </Touchable>
        </View>

    )
}

export const SnackBar = React.memo(SnackBar_)

SnackBar_.propTypes = {

}

SnackBar_.defaultProps = {

}
