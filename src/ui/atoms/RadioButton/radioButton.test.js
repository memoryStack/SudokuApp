import * as React from 'react'

import { render, screen } from '@utils/testing/testingLibrary'
import { PersistentRender } from '@utils/testing/persistentRender'

import Radio from './RadioButton'
import { TEST_IDS } from './radioButton.constants'
import { waitFor } from '@testing-library/react-native'

describe('radio button functionality', () => {
    test('renders only the outer circle if not selected', async () => {
        render(<Radio isSelected={false} />)

        await waitFor(() => {
            expect(screen.queryByTestId(TEST_IDS.OUTER_RING)).toBeOnTheScreen()
        })

        expect(screen.queryByTestId(TEST_IDS.INNER_DOT)).not.toBeOnTheScreen()
    })

    test('renders only inner circle once state changes from not selected to selected', async () => {
        render(<Radio isSelected={false} />)

        await waitFor(() => {
            expect(screen.queryByTestId(TEST_IDS.OUTER_RING)).toBeOnTheScreen()
        })

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

    test.skip('changes color when selected/disabled state is toggled', async () => {
        const aPersistentRender = new PersistentRender(
            {
                getRenderingResultToCompare: () => {
                    const element = screen.getByTestId(TEST_IDS.OUTER_RING)
                    return [element.props.style.borderColor]
                },
            },
        )

        aPersistentRender.render(<Radio isSelected={false} />)
        await waitFor(() => {
            expect(screen.queryByTestId(TEST_IDS.OUTER_RING)).toBeOnTheScreen()
        })
        aPersistentRender.update(<Radio isSelected />)

        expect(aPersistentRender.getChangedRenderingResultStatus()).toEqual([true])

        aPersistentRender.update(<Radio isSelected={false} disabled />)
        expect(aPersistentRender.getChangedRenderingResultStatus()).toEqual([true])
    })
})
