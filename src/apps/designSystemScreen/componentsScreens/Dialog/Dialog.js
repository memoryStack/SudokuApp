import React, { memo } from 'react'

import { View } from 'react-native'

import _noop from '@lodash/noop'

import Dialog from '@ui/molecules/Dialog'

import { styles } from './dialog.styles'

const DividerDemo = () => {
    const renderBody = () => (
        <View style={{
            width: 100,
            height: 100,
            backgroundColor: 'red',
        }}
        />
    )

    return (
        <View style={styles.container}>
            <Dialog
                title="Test Title"
                description="there goes some description there goes some description there goes some description there goes some description"
                body={renderBody()}
                showDivider
                footerButtonsConfig={[
                    { label: 'Cancel', onClick: _noop },
                    { label: 'Save', onClick: _noop },
                ]}
            />
        </View>
    )
}

export default memo(DividerDemo)
