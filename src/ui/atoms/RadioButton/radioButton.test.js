import * as React from 'react'

import { render, screen } from 'testing-utils'

import Radio from './RadioButton'
import { TEST_IDS } from './radioButton.constants'

// TODO: i don't see options available to me for "screen" object
// this is important to fix

test('snapshot for not selected radio button', () => {
    const tree = render(<Radio isSelected={false} />).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for selected radio button', () => {
    const tree = render(<Radio isSelected />).toJSON()
    expect(tree).toMatchSnapshot()
})

test('snapshot for disabled radio button', () => {
    const tree = render(<Radio disabled />).toJSON()
    expect(tree).toMatchSnapshot()
})

describe('radio button functionality', () => {
    test('renders only the outer circle if not selected', () => {
        render(<Radio isSelected={false} />)

        expect(screen.getByTestId(TEST_IDS.OUTER_RING)).toBeTruthy()
        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).toBeFalsy()
    })

    test('renders only inner circle once state changes from not selected to selected', () => {
        render(<Radio isSelected={false} />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).toBeFalsy()

        screen.update(<Radio isSelected />)

        expect(screen.getByTestId(TEST_IDS.INNER_DOT)).toBeTruthy()
    })

    test('inner dot is not rendered if disabled is true but parent component mistakenly marks Radio as selected', () => {
        render(<Radio isSelected={false} disabled />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).toBeFalsy()

        screen.update(<Radio isSelected disabled />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).toBeFalsy()
    })

    test('changes color when selected/disabled state is toggled', () => {
        // TODO: think for a util which will check if a property changed or not
        //          between the renderings
        const getOuterRingColor = () => screen.getByTestId(TEST_IDS.OUTER_RING).props.style.borderColor

        render(<Radio isSelected={false} />)

        let previousRenderColor
        let currentRenderColor = getOuterRingColor()

        screen.update(<Radio isSelected />)

        previousRenderColor = currentRenderColor
        currentRenderColor = getOuterRingColor()
        expect(currentRenderColor !== previousRenderColor).toBeTruthy()

        screen.update(<Radio isSelected={false} disabled />)

        previousRenderColor = currentRenderColor
        currentRenderColor = getOuterRingColor()
        expect(currentRenderColor !== previousRenderColor).toBeTruthy()
    })
})
