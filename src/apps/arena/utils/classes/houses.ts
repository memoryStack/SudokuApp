import { HOUSE_TYPE } from '../smartHints/constants'

export class Houses {
    static isRowHouse(houseType: HouseType) {
        return houseType === HOUSE_TYPE.ROW
    }

    static isColHouse(houseType: HouseType) {
        return houseType === HOUSE_TYPE.COL
    }

    static isBlockHouse(houseType: HouseType) {
        return houseType === HOUSE_TYPE.BLOCK
    }
}
