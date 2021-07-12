import React, { useState, useCallback, useEffect } from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import { noOperationFunction } from '../../utils/util'

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: '100%',
    },
})

const Page_ = ({ children, onLayout = noOperationFunction }) => {
    return (
        <SafeAreaView
            onLayout={onLayout}
            style={styles.safeAreaView}
        >
            {children}
        </SafeAreaView>
    )
}

export const Page = React.memo(Page_)
