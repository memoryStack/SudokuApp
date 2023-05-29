import * as React from 'react'

import { render, screen, fireEvent } from 'testing-utils'

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

// TODO: add color changes functionality cases as well
//         should i add test-cases if prop-override colors are working fine or not ?
describe('Button functionality', () => {
    test('renders only the outer circle if not selected', () => {
        const buttonLabel = 'test button'
        render(<Button label={buttonLabel} />)

        expect(screen.getByText(buttonLabel)).toBeTruthy()
    })

    test('performs onClick when pressed', () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button label={buttonLabel} onClick={onClick} />)

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('for disabled state onClick is not called on user press', () => {
        const buttonLabel = 'test button'
        const onClick = jest.fn()
        render(<Button state={BUTTON_STATES.DISABLED} label={buttonLabel} onClick={onClick} />)

        fireEvent.press(screen.getByText(buttonLabel))
        expect(onClick).toHaveBeenCalledTimes(0)
    })
})
