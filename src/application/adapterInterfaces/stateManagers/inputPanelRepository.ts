export interface InputPanelRepository {
    setLockedNumber: (number: number) => void
    unlockNumber: () => void
    getIsNumberLocked: () => boolean
    getLockedNumber: () => number
}
