import * as React from 'react'

import { render, screen, fireEvent } from '@utils/testing/testingLibrary'
import { PersistentRender } from '@utils/testing/persistentRender'

import Button from './Button'
import { BUTTON_STATES, BUTTON_TYPES } from './button.constants'
import { waitFor } from '@testing-library/react-native'

describe('Button functionality', () => {
    test('renders button with passed text label', async () => {
        const buttonLabel = 'test button'
        render(<Button label={buttonLabel} />)

        await waitFor(() => {
            expect(screen.queryByText(buttonLabel)).toBeOnTheScreen()
        })
    })

    test('performs onClick when pressed', async () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button label={buttonLabel} onPress={onClick} />)

        await waitFor(() => {
            expect(screen.queryByText(buttonLabel)).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('for disabled state onClick is not called on user press', async () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button state={BUTTON_STATES.DISABLED} label={buttonLabel} onPress={onClick} />)

        await waitFor(() => {
            expect(screen.queryByText(buttonLabel)).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(0)
    })

    test.skip('changes appearence when button state is toggled', () => {
        const buttonLabel = 'test button'

        const aPersistentRender = new PersistentRender({
            getRenderingResultToCompare: () => {
                const element = screen.getByText(buttonLabel)
                return [element.props.style.color]
            },
        })
        aPersistentRender.render(<Button state={BUTTON_STATES.ENABLED} label={buttonLabel} />)
        aPersistentRender.update(<Button state={BUTTON_STATES.DISABLED} label={buttonLabel} />)

        expect(aPersistentRender.getChangedRenderingResultStatus()).toEqual([true])
    })
})

describe('Styles Overrides', () => {
    test('applies override styles from prop to both button and text', async () => {
        const buttonLabel = 'test button'
        const textStyles = { color: 'green' }
        const containerStyle = { width: 80 }

        render(<Button label={buttonLabel} textStyles={textStyles} containerStyle={containerStyle} />)

        await waitFor(() => {
            expect(screen.queryByText(buttonLabel)).toBeOnTheScreen()
        })

        expect(screen.getByText(buttonLabel)).toHaveStyle(textStyles)
        expect(screen.getByRole('button')).toHaveStyle(containerStyle)
    })

    test('applies override styles from prop to both button and text', async () => {
        const containerStyle = { width: 80, height: 40 }
        render(<Button avoidDefaultContainerStyles containerStyle={containerStyle} />)

        // to match is used here because default button is TouchableOpacity and this adds
        // opacity: 1 by default internally
        // NOTE: this and above test-cases are are kind of similar
        await waitFor(() => {
            expect(screen.queryByRole('button')).toBeOnTheScreen()
        })

        expect(screen.getByRole('button')).toHaveStyle(containerStyle)
    })
})
