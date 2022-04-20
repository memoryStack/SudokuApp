import { getHouseCells } from '../../houseCells'
import { getCellsCommonHouses, isCellEmpty, isCellNoteVisible, areSameCellsSets } from '../../util'
import { HOUSE_TYPE } from '../constants'

const HOST_CELLS_COMMON_HOUSES_COUNT = 2

export const areValidOmissionHostCells = (hostCells) => {
    if (hostCells.length < 2) return false

    const cellsCommonHouses = Object.values(getCellsCommonHouses(hostCells)).filter((value) => {
        return value
    })

    return cellsCommonHouses.length === HOST_CELLS_COMMON_HOUSES_COUNT
}

// TODO: change it's name to something more expressive intent
// TODO: this func is doing 2 things. transform it
export const isNoteHaveOmissionInHouse = (note, house, mainNumbers, notesData) => {
    
    const houseCells = getHouseCells(house.type, house.num)

    const hostCells = houseCells.filter((cell) => {
        return isCellEmpty(cell, mainNumbers)
    }).filter((cell) => {
        return isCellNoteVisible(note, notesData[cell.row][cell.col])
    })

    return {
        present: areValidOmissionHostCells(hostCells),
        hostCells,
    }
}

export const getHouseOmissions = (house, mainNumbers, notesData) => {
    const result = []
    for (let note=1;note<=9;note++) {

        const { present, hostCells } = isNoteHaveOmissionInHouse(note, house, mainNumbers, notesData)
        if (present) {
            result.push({
                house,
                note, 
                hostCells
            })
        }
    }

    return result
}

const isDuplicateOmission = (newOmission, allOmissions) => {
    return allOmissions.some((existingOmission) => {
        const isSameNote = newOmission.note === existingOmission.note
        return isSameNote && areSameCellsSets(newOmission.hostCells, existingOmission.hostCells)
    })
}

/**
    Note: naked groups will also contribute to this hint
    should i seperate these or let it stay as it is ?
 */
export const getAllOmissions = (mainNumbers, notesData) => {
    const result = []
    
    const allHouses = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    allHouses.forEach((houseType) => {
        for (let houseNum=0;houseNum<9;houseNum++) {
            const house = { type: houseType, num: houseNum }

            const newOmissions = getHouseOmissions(house, mainNumbers, notesData)
            .filter((newOmission) => {
                return !isDuplicateOmission(newOmission , result)
            })
            result.push(...newOmissions)
        }
    })

    return result
}