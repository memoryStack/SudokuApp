import React, { useContext } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import Button from '@ui/molecules/Button'

import ModalContext from '@contexts/ModalContext'

import { fireEvent, render, screen } from '@utils/testing/testingLibrary'

import { MODAL_TEST_ID } from './modalProvider.constants'
import { waitFor } from '@testing-library/react-native'

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
            <Button label="Open" onPress={handleOpenPress} />
            <Button label="Close" onPress={handleClosePress} />
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
    test('will show UI on request', async () => {
        render(<TestingComponent />)

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()

        await waitFor(() => {
            expect(screen.queryByText('Open')).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')
    })

    test('will close UI on request from child', async () => {
        render(<TestingComponent />)

        await waitFor(() => {
            expect(screen.queryByText('Open')).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByText('Close'))

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()
    })

    test('will close UI on overlay click by default', async () => {
        render(<TestingComponent />)

        await waitFor(() => {
            expect(screen.queryByText('Open')).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByTestId(MODAL_TEST_ID))

        expect(screen.queryByTestId('dummy-ui')).not.toBeOnTheScreen()
    })

    test('close UI on overlay click can be disabled', async () => {
        render(<TestingComponent closeOnBackdropClick={false} />)

        await waitFor(() => {
            expect(screen.queryByText('Open')).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText('Open'))

        screen.getByTestId('dummy-ui')

        fireEvent.press(screen.getByTestId(MODAL_TEST_ID))

        screen.getByTestId('dummy-ui')
    })

    test('lets to override the props applied to the child element', async () => {
        render(<TestingComponent
            closeOnBackdropClick={false}
            uiCustomProps={{
                testProp: 'testProp',
            }}
        />)

        await waitFor(() => {
            expect(screen.queryByText('Open')).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText('Open'))

        expect(screen.getByTestId('dummy-ui')).toHaveProp('testProp', 'testProp')
    })
})
