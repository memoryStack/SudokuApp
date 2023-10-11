import * as React from 'react'

import { render, screen, fireEvent } from '@utils/testing/testingLibrary'
import { PersistentRender } from '@utils/testing/persistentRender'

import Button from './Button'
import { BUTTON_STATES, BUTTON_TYPES } from './button.constants'

test('snapshot for filled button in enabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.FILLED}
            state={BUTTON_STATES.ENABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for filled button in disabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.FILLED}
            state={BUTTON_STATES.DISABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for tonal button in enabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.TONAL}
            state={BUTTON_STATES.ENABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for tonal button in disabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.TONAL}
            state={BUTTON_STATES.DISABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for text button in enabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.TEXT}
            state={BUTTON_STATES.ENABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for text button in disabled state', () => {
    const tree = render(
        <Button
            label="test button"
            type={BUTTON_TYPES.TEXT}
            state={BUTTON_STATES.DISABLED}
        />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('Button functionality', () => {
    test('renders button with passed text label', () => {
        const buttonLabel = 'test button'
        render(<Button label={buttonLabel} />)

        screen.getByText(buttonLabel)
    })

    test('performs onClick when pressed', () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button label={buttonLabel} onPress={onClick} />)

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('for disabled state onClick is not called on user press', () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button state={BUTTON_STATES.DISABLED} label={buttonLabel} onPress={onClick} />)

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(0)
    })

    test('changes appearence when button state is toggled', () => {
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
    test('applies override styles from prop to both button and text', () => {
        const buttonLabel = 'test button'
        const textStyles = { color: 'green' }
        const containerStyle = { width: 80 }

        render(<Button label={buttonLabel} textStyles={textStyles} containerStyle={containerStyle} />)

        expect(screen.getByText(buttonLabel)).toHaveStyle(textStyles)
        expect(screen.getByRole('button')).toHaveStyle(containerStyle)
    })

    test('applies override styles from prop to both button and text', () => {
        const containerStyle = { width: 80, height: 40 }
        render(<Button avoidDefaultContainerStyles containerStyle={containerStyle} />)

        // to match is used here because default button is TouchableOpacity and this adds
        // opacity: 1 by default internally
        // NOTE: this and above test-cases are are kind of similar
        expect(screen.getByRole('button')).toHaveStyle(containerStyle)
    })
})
