import * as React from 'react'

import { render } from 'testing-utils' // TODO: fix the eslint error

import Radio from './RadioButton'

test('renders checked Checkbox with onPress', () => {
    const tree = render(
        <Radio />,
    ).toJSON()

    expect(tree).toMatchSnapshot()
})
