import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'
import { PersistentRender } from '@utils/testing/persistentRender'

import Radio from './RadioButton'
import { TEST_IDS } from './radioButton.constants'

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

        screen.getByTestId(TEST_IDS.OUTER_RING)
        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).not.toBeOnTheScreen()
    })

    test('renders only inner circle once state changes from not selected to selected', () => {
        render(<Radio isSelected={false} />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).not.toBeOnTheScreen()

        screen.update(<Radio isSelected />)

        screen.getByTestId(TEST_IDS.INNER_DOT)
    })

    test('inner dot is not rendered if disabled is true but parent component mistakenly marks Radio as selected', () => {
        render(<Radio isSelected={false} disabled />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).not.toBeOnTheScreen()

        screen.update(<Radio isSelected disabled />)

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).not.toBeOnTheScreen()
    })

    test('changes color when selected/disabled state is toggled', () => {
        const aPersistentRender = new PersistentRender(
            {
                getRenderingResultToCompare: () => {
                    const element = screen.getByTestId(TEST_IDS.OUTER_RING)
                    return [element.props.style.borderColor]
                },
            },
        )

        aPersistentRender.render(<Radio isSelected={false} />)
        aPersistentRender.update(<Radio isSelected />)

        expect(aPersistentRender.getChangedRenderingResultStatus()).toEqual([true])

        aPersistentRender.update(<Radio isSelected={false} disabled />)
        expect(aPersistentRender.getChangedRenderingResultStatus()).toEqual([true])
    })
})
