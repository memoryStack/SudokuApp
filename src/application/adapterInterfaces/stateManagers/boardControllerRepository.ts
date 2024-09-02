import { PENCIL_STATE } from '../../constants'

export interface BoardControllerRepository {
    getHintsLeftCount: () => number
    resetState: () => void
    setHintsLeftCount: (hints: number) => void
    incrementHintsUsed: () => void
    getHintsUsed: () => number
    setPencil: (pencilState: PENCIL_STATE) => void
    getPencil: () => PENCIL_STATE
    setHintsMenuVisibility: (visible: boolean) => void
}
