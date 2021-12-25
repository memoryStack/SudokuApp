import React from 'react';
import renderer from 'react-test-renderer'
import { Home } from '.'

jest.useFakeTimers()
test('renders correctly', () => {
  const homeTree = renderer.create(<Home />).toJSON()
  expect(homeTree).toMatchSnapshot()
})
