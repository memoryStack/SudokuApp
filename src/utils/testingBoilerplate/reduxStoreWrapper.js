import React from 'react'
import { Provider } from 'react-redux'

export const testStoreWrapper = ({ store, children }) => <Provider store={store}>{children}</Provider>
