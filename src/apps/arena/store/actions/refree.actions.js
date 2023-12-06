import { invokeDispatch } from '../../../../redux/dispatch.helpers'
import { refreeActions } from '../reducers/refree.reducers'

const { increaseMistakes } = refreeActions

// TODO: maybe change the namings
export const addMistake = () => {
    invokeDispatch(increaseMistakes())
}
