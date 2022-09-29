import { LEG_TYPES, XWING_TYPES } from './constants'
import {
    areSameCells,
    areSameColCells,
    areSameRowCells,
    getCellHouseInfo,
    getHouseAxesValue,
    isCellEmpty,
    isCellExists,
    isCellNoteVisible,
    getBlockAndBoxNum,
    getCellBlockHouseInfo,
} from '../../util'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE, HOUSE_TYPE_VS_FULL_NAMES } from '../constants'
import { xx_getHouseCells } from '../../houseCells'
import { toOrdinal } from 'lodash/src/utils/toOrdinal'
import { getCellsAxesValuesListText } from '../tryOutInputAnalyser/helpers'
import { TRY_OUT_RESULT_STATES } from '../tryOutInputAnalyser/constants'
import { getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { getStoreState } from '../../../../../redux/dispatch.helpers'
import _flatten from 'lodash/src/utils/flatten'
import { getMainNumbers } from '../../../store/selectors/board.selectors'

export const categorizeLegs = (legA, legB) => {
    const perfectLeg = legA.type === LEG_TYPES.PERFECT ? legA : legB
    const otherLeg = perfectLeg === legA ? legB : legA

    return {
        perfectLeg,
        otherLeg,
    }
}

export const categorizeFinnedLegCells = (perfectLegHostCells, finnedLegHostCells) => {
    const perfectCells = finnedLegHostCells.filter(finnedLegCell => {
        return perfectLegHostCells.some(perfectLegCell => {
            const cellsPair = [finnedLegCell, perfectLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
    })

    const finnCells = finnedLegHostCells.filter(cell => !isCellExists(cell, perfectCells))

    return {
        perfect: perfectCells,
        finns: finnCells,
    }
}

export const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

export const getFinnedXWingRemovableNotesHostCells = ({ houseType, legs }, notesData) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, otherLeg.cells)
    const xWingBaseCells = [...otherLeg.cells, ...perfectLeg.cells]

    return xx_getHouseCells(getCellBlockHouseInfo(finns[0])).filter(cell => {
        if (
            isCellExists(cell, xWingBaseCells) ||
            !isCellNoteVisible(perfectLeg.candidate, notesData[cell.row][cell.col])
        )
            return false
        return perfectCells.some(perfectCell => {
            const cellsPair = [cell, perfectCell]
            if (getCrossHouseType(houseType) === HOUSE_TYPE.ROW) return areSameRowCells(cellsPair)
            return areSameColCells(cellsPair)
        })
    })
}

export const getPerfectCellsInFinnedBlock = legs => {
    const { perfectLeg, otherLeg: finnedLeg } = categorizeLegs(...legs)
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLeg.cells, finnedLeg.cells)
    return perfectCells.filter(perfectCell => {
        return finns.some(finnCell => {
            return getBlockAndBoxNum(finnCell).blockNum === getBlockAndBoxNum(perfectCell).blockNum
        })
    })
}

export const addCellInXWingLeg = (cell, legCells, houseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    legCells.push(cell)
    legCells.sort((cellA, cellB) => {
        return cellA[crossHouseType] - cellB[crossHouseType]
    })
}

export const getXWingCandidate = xWing => {
    return xWing.legs[0].candidate
}

export const getXWingHosuesInOrder = xWing => {
    return xWing.legs.map(({ cells }) => {
        return getCellHouseInfo(xWing.houseType, cells[0])
    })
}

export const getXWingCells = xWingLegs => {
    return _flatten(xWingLegs.map(leg => leg.cells))
}

/* hint text and try-out helpers */
// TODO: move these helpers to separate file

export const getXWingHousesTexts = (houseType, xWingLegs) => {
    const { houseANum, houseBNum } = getXWingHousesNums(houseType, xWingLegs)
    return {
        houseAAxesValue: getHouseAxesText({ type: houseType, num: houseANum }),
        houseBAxesValue: getHouseAxesText({ type: houseType, num: houseBNum }),
    }
}

const getXWingHousesNums = (houseType, xWingLegs) => {
    return {
        houseANum: getCellHouseInfo(houseType, xWingLegs[0].cells[0]).num,
        houseBNum: getCellHouseInfo(houseType, xWingLegs[1].cells[0]).num,
    }
}

export const getHouseAxesText = house => {
    const houseAxesValue = getHouseAxesValue(house)
    if (house.type === HOUSE_TYPE.ROW) return houseAxesValue
    return toOrdinal(parseInt(houseAxesValue, 10))
}

export const getCrossHouseAxesText = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    const { crossHouseANum, crossHouseBNum } = getCrossHousesNums(xWing)
    return {
        crossHouseAAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseANum }),
        crossHouseBAxesValue: getHouseAxesText({ type: crossHouseType, num: crossHouseBNum }),
    }
}

const getCrossHousesNums = xWing => {
    const crossHouseType = getCrossHouseType(xWing.houseType)
    return {
        crossHouseANum: getCellHouseInfo(crossHouseType, xWing.legs[0].cells[0]).num,
        crossHouseBNum: getCellHouseInfo(crossHouseType, xWing.legs[0].cells[1]).num,
    }
}

export const getXWingRectangleCornersAxesText = xWingLegs => {
    const cornersList = [...xWingLegs[0].cells, xWingLegs[1].cells[1], xWingLegs[1].cells[0]]
    cornersList.push(cornersList[0])
    return getCellsAxesValuesListText(cornersList)
}

export const getDiagonalsCornersAxesTexts = xWing => {
    const { topLeft, topRight, bottomLeft, bottomRight } = getXWingCornerCells(xWing)
    return {
        topDown: getCellsAxesValuesListText([topLeft, bottomRight]),
        bottomUp: getCellsAxesValuesListText([bottomLeft, topRight]),
    }
}

const getXWingCornerCells = xWing => {
    const houseType = xWing.houseType
    const xWingLegs = xWing.legs
    return {
        topLeft: xWingLegs[0].cells[0],
        topRight: houseType === HOUSE_TYPE.COL ? xWingLegs[1].cells[0] : xWingLegs[0].cells[1],
        bottomLeft: houseType === HOUSE_TYPE.COL ? xWingLegs[0].cells[1] : xWingLegs[1].cells[0],
        bottomRight: xWingLegs[1].cells[1],
    }
}

export const getNoInputResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    const houseFullName = HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
    return {
        msg:
            `try filling ${candidate} in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName}` +
            ` to understand why all ${candidate} highlighted in red color can't come there and is safe to remove`,
        state: TRY_OUT_RESULT_STATES.START,
    }
}

export const filterFilledCells = cells => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())

    return cells.filter(cell => {
        return isCellEmpty(cell, mainNumbers) && !isCellEmpty(cell, tryOutMainNumbers)
    })
}

export const getSashimiCell = xWing => {
    const { houseType, legs } = xWing
    const { perfectLeg, otherLeg } = categorizeLegs(...legs)
    const { sashimiAligned } = categorizeSashimiXWingPerfectLegCells(perfectLeg.cells, otherLeg.cells)

    if (houseType === HOUSE_TYPE.ROW) {
        return {
            row: otherLeg.cells[0].row,
            col: sashimiAligned.col,
        }
    } else {
        return {
            row: sashimiAligned.row,
            col: otherLeg.cells[0].col,
        }
    }
}

export const categorizeSashimiXWingPerfectLegCells = (perfectLegCells, otherLegCells) => {
    const result = {}
    perfectLegCells.forEach(perfectLegCell => {
        // TODO: this below loop is repeating again and again
        // extract it
        const isAligned = otherLegCells.some(otherLegCell => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
        if (isAligned) result.perfectAligned = perfectLegCell
        else result.sashimiAligned = perfectLegCell
    })
    return result
}

// TODO: change it's name to make it more compact and descriptive
export const getSameCrossHouseCandidatePossibilitiesResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const candidate = getXWingCandidate(xWing)

    const xWingCellsWithCandidateAsNote = filterCellsWithXWingCandidateAsNote(xWingCells, candidate)
    const xWingHostCellsTexts = getCellsAxesValuesListText(
        xWingCellsWithCandidateAsNote,
        HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND,
    )

    const crossHouseType = getCrossHouseType(xWing.houseType)
    const crossHouse = getCellHouseInfo(crossHouseType, xWingCellsWithCandidateAsNote[0])

    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg:
            `now to fill ${candidate} in ${houseAAxesValue} and ${houseBAxesValue}` +
            ` ${HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL} we have` +
            ` two cells ${xWingHostCellsTexts} but both of these cells are in` +
            ` ${getHouseAxesText(crossHouse)} ${HOUSE_TYPE_VS_FULL_NAMES[crossHouseType].FULL_NAME} `,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const filterCellsWithXWingCandidateAsNote = (cells, candidate) => {
    const notes = getTryOutNotes(getStoreState())
    return cells.filter(cell => {
        return isCellNoteVisible(candidate, notes[cell.row][cell.col])
    })
}

export const getOneLegWithNoCandidateResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const xWingLegWithCandidateAsInhabitable = getCandidateInhabitableLeg(candidate, xWing.legs)
    const inhabitableHouseAxesText = getHouseAxesText(
        getCellHouseInfo(xWing.houseType, xWingLegWithCandidateAsInhabitable.cells[0]),
    )
    return {
        msg:
            `there is no cell in ${inhabitableHouseAxesText} ${getXWingHouseFullName(xWing)}` +
            ` where ${candidate} can come`,
        state: TRY_OUT_RESULT_STATES.ERROR,
    }
}

const getCandidateInhabitableLeg = (candidate, xWingLegs) => {
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const mainNumbers = getMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    return xWingLegs.find(({ cells: legXWingCells }) => {
        return legXWingCells.every(xWingCell => {
            // handles sashimi finned x-wing as well
            return (
                (isCellEmpty(xWingCell, tryOutMainNumbers) || !isCellEmpty(xWingCell, mainNumbers)) &&
                !isCellNoteVisible(candidate, notes[xWingCell.row][xWingCell.col])
            )
        })
    })
}

export const getXWingHouseFullName = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME
}

export const getXWingHouseFullNamePlural = xWing => {
    return HOUSE_TYPE_VS_FULL_NAMES[xWing.houseType].FULL_NAME_PLURAL
}

export const getLegsFilledWithoutErrorResult = xWing => {
    const xWingCells = getXWingCells(xWing.legs)
    const filledXWingCells = filterFilledCells(xWingCells)

    if (filledXWingCells.length === 1) {
        return getOneLegFilledWithoutErrorResult(xWing)
    }
    return getBothLegsFilledWithoutErrorResult(xWing)
}

const getOneLegFilledWithoutErrorResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullName(xWing)

    const filledXWingCells = filterFilledCells(getXWingCells(xWing.legs))

    const filledLegHouse = getCellHouseInfo(xWing.houseType, filledXWingCells[0])
    const houseAxesText = getHouseAxesText(filledLegHouse)
    return {
        msg:
            `${candidate} is filled in ${houseAxesText} ${houseFullName} without any error, try filling it` +
            ` in other places as well where it is highlighted in red or green color`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}

const getBothLegsFilledWithoutErrorResult = xWing => {
    const candidate = getXWingCandidate(xWing)
    const houseFullName = getXWingHouseFullNamePlural(xWing)
    const { houseAAxesValue, houseBAxesValue } = getXWingHousesTexts(xWing.houseType, xWing.legs)
    return {
        msg:
            `${candidate} is filled in ${houseAAxesValue} and ${houseBAxesValue} ${houseFullName} without error` +
            ` and all the red colored ${candidate}s are also removed.`,
        state: TRY_OUT_RESULT_STATES.VALID_PROGRESS,
    }
}
