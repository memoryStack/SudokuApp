import React, { useState, useMemo, useEffect, useCallback } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import ModalContext from '@contexts/ModalContext'

import { useStyles } from '@utils/customHooks/useStyles'

import StopTouchPropagation from '@ui/molecules/StopTouchPropagation'

import { Touchable, TouchableTypes } from '../../apps/components/Touchable'

import { DEFAULT_STATE, MODAL_TEST_ID } from './modalProvider.constants'
import { getStyles } from './modalProvider.style'
import _noop from '@lodash/noop'
import { usePrevious } from '@utils/customHooks'

const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(DEFAULT_STATE)

    const styles = useStyles(getStyles)

    const previousModal = usePrevious(modal)

    useEffect(() => {
        const wasVisible = previousModal && previousModal.show
        const isVisible = modal.show
        if (wasVisible && !isVisible) {
            previousModal.onCloseCallback()
        }
    }, [previousModal, modal])

    const handleBackdropPress = () => {
        if (!modal.closeOnBackdropClick) return
        setModal(DEFAULT_STATE)
    }

    const renderModal = () => {
        if (!modal.show) return null

        const { Component, props } = modal
        return (
            <Touchable
                testID={MODAL_TEST_ID}
                touchable={TouchableTypes.withoutFeedBack}
                onPress={handleBackdropPress}
            >
                <View style={styles.backdrop}>
                    <StopTouchPropagation>
                        <Component {...props} />
                    </StopTouchPropagation>
                </View>
            </Touchable>
        )
    }

    const showModal = useCallback(({ Component, props, closeOnBackdropClick = true, onCloseCallback = _noop }) => {
        setModal({
            show: true,
            Component,
            props,
            closeOnBackdropClick,
            onCloseCallback
        })
    }, [])

    const hideModal = useCallback(() => {
        setModal(DEFAULT_STATE)
    }, [])

    const contextValues = useMemo(() => ({
        show: modal.show,
        showModal,
        hideModal,
    }), [modal.show, showModal, hideModal])

    return (
        <ModalContext.Provider value={contextValues}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    )
}

export default React.memo(ModalProvider)

ModalProvider.propTypes = {
    children: PropTypes.element.isRequired,
}
