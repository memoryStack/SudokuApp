
import { invokeDispatch } from "../../../../redux/dispatch.helpers"

import { resetMistakes, increaseMistakes, setMistakes } from '../reducers/refree.reducers'

export const clearMistakes = () => invokeDispatch(resetMistakes())

// TODO: maybe change the namings
export const addMistake = () => invokeDispatch(increaseMistakes())

export const updateMistakes = (mistakes) => invokeDispatch(setMistakes(mistakes))
