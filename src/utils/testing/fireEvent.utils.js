import { fireEvent } from './testingLibrary'

/*
    structure of layoutData will be
        const layoutData = {
            width: 520,
            height: 70.5,
            x: 0,
            y: 42.5
        }
*/

export const fireLayoutEvent = (view, layoutData) => {
    fireEvent(view, 'layout', {
        nativeEvent: {
            layout: layoutData,
        },
    })
}
