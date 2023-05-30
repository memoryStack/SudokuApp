import { configureStore } from '@reduxjs/toolkit'
import { initDispatch, initGetState } from '../../../redux/dispatch.helpers'

export const makeTestStore = reducer => {
    const store = configureStore({ reducer })

    // TODO: for now hacking it like this.
    // but need to remove coupling of store state with the  lower
    // level util functions like "isHintValid". need to pay attention
    // to architecture of the app.

    initDispatch(store.dispatch)
    initGetState(store.getState)

    return store
}
