import React, { useContext } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import Button from '@ui/molecules/Button'

import ModalContext from '@contexts/ModalContext'

import { fireEvent, render, screen } from '@utils/testing/testingLibrary'

import { MODAL_TEST_ID } from './modalProvider.constants'

const TestingComponent = ({
    uiCustomProps = {},
    closeOnBackdropClick = true,
}) => {
    const { showModal, hideModal } = useContext(ModalContext)

    const dummyUI = props => <View testID="dummy-ui" {...props} />

    const handleOpenPress = () => {
        showModal({
            Component: dummyUI,
            props: uiCustomProps,
            closeOnBackdropClick,
        })
    }

    const handleClosePress = () => {
        hideModal()
    }

    return (
        <>
            <Button label="Open" onClick={handleOpenPress} />
            <Button label="Close" onClick={handleClosePress} />
        </>
    )
}

TestingComponent.propTypes = {
    uiCustomProps: PropTypes.object,
    closeOnBackdropClick: PropTypes.bool,
}

TestingComponent.defaultProps = {
    uiCustomProps: {},
    closeOnBackdropClick: true,
}

describe('ModalProvider', () => {
    test('will show UI on request', () => {
        render(<TestingComponent />)

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')
    })

    test('will close UI on request from child', () => {
        render(<TestingComponent />)

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByText('Close'))

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()
    })

    test('will close UI on overlay click by default', () => {
        render(<TestingComponent />)

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByTestId(MODAL_TEST_ID))

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()
    })

    test('close UI on overlay click can be disabled', () => {
        render(<TestingComponent closeOnBackdropClick={false} />)

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByTestId(MODAL_TEST_ID))

        screen.getByTestId('dummy-ui')
    })

    test('lets to override the props applied to the child element', () => {
        render(<TestingComponent
            closeOnBackdropClick={false}
            uiCustomProps={{
                testProp: 'testProp',
            }}
        />)

        fireEvent.press(screen.getByText('Open'))

        expect(screen.getByTestId('dummy-ui')).toHaveProp('testProp', 'testProp')
    })
})
