// this interface is defined by domain

import { PENCIL_STATE } from '@resources/constants'

export interface BoardControllerRepository {
    getHintsLeftCount: () => number
    resetState: () => void
    setHintsLeftCount: (hints: number) => void
    setPencil: (pencilState: PENCIL_STATE) => void
    getPencil: () => PENCIL_STATE
    setHintsMenuVisibility: (visible: boolean) => void
}
