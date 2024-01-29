import { HOUSE_TYPE } from '../constants'
import { EmptyRectangleRawHint } from './types'

export const getBlockHostHouse = (emptyRectangle: EmptyRectangleRawHint) => {
    return {
        type: HOUSE_TYPE.BLOCK,
        num: emptyRectangle.hostHouse.block
    }
}
