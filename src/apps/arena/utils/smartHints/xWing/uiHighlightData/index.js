import { XWING_TYPES } from '../constants'
import { getFinnedXWingUIData } from './finnedXWing'
import { getPerfectXWingUIData } from './perfectXWing'

export const getUIHighlightData = (xWings, notesData) => {
    if (!xWings.length) return null

    return xWings.map(({ type, houseType, legs }) => {
        if (type === XWING_TYPES.PERFECT) return getPerfectXWingUIData({ houseType, legs }, notesData)
        if (type === XWING_TYPES.FINNED) return getFinnedXWingUIData({ houseType, legs }, notesData)

        // return getPerfectXWingUIData(xWing, notesData)
    })
}
