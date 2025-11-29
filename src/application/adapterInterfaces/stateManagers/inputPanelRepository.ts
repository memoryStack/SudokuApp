export enum INPUT_TYPE {
    NOTES = 'NOTES',
    MAIN_NUMBERS = 'MAIN_NUMBERS'
}

export type LockNumber = {
    number: number;
    type: INPUT_TYPE
}

export interface InputPanelRepository {
    setLockedNumber: (number: LockNumber) => void
    unlockNumber: () => void
    getIsNumberLocked: () => boolean
    getLockedNumber: () => LockNumber
}
