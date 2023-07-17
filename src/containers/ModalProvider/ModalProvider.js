import React, { useState, useMemo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import ModalContext from '@contexts/ModalContext'

import { useStyles } from '@utils/customHooks/useStyles'

import { Touchable, TouchableTypes } from '../../apps/components/Touchable'

import { DEFAULT_STATE, MODAL_TEST_ID } from './modalProvider.constants'
import { getStyles } from './modalProvider.style'

const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(DEFAULT_STATE)

    const styles = useStyles(getStyles)

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
                    <Component {...props} />
                </View>
            </Touchable>
        )
    }

    const contextValues = useMemo(() => ({
        showModal: ({ Component, props, closeOnBackdropClick = true }) => {
            setModal({
                show: true,
                Component,
                props,
                closeOnBackdropClick,
            })
        },
        hideModal: () => {
            setModal(DEFAULT_STATE)
        },
    }), [])

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
