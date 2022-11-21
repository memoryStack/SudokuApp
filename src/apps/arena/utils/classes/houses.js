import { HOUSE_TYPE } from '../smartHints/constants'

export class Houses {
    static isRowHouse(houseType) {
        return houseType === HOUSE_TYPE.ROW
    }

    static isColHouse(houseType) {
        return houseType === HOUSE_TYPE.COL
    }

    static isBlockHouse(houseType) {
        return houseType === HOUSE_TYPE.BLOCK
    }
}
