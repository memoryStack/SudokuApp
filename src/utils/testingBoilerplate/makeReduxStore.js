import { configureStore } from '@reduxjs/toolkit'

export const makeTestStore = (reducer) => configureStore({ reducer })