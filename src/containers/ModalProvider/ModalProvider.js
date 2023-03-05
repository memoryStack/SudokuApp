import React, { useState, useMemo } from 'react'

import { View } from 'react-native'

import ModalContext from 'src/contexts/ModalContext'

import { styles } from './modalProvider.style'

const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({
        show: false,
        Component: null,
    })

    const contextValues = useMemo(() => ({
        // TODO: add option for adding component props here
        showModal: ({ Component, props }) => {
            setModal({
                show: true,
                Component,
                props,
            })
        },
        hideModal: () => {
            setModal({ show: false })
        },
    }), [])

    const renderModal = () => {
        if (!modal.show) return null

        const { Component, props } = modal

        return (
            <View style={styles.overlay}>
                <Component {...props} />
            </View>
        )
    }

    return (
        <ModalContext.Provider value={contextValues}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    )
}

export default ModalProvider
