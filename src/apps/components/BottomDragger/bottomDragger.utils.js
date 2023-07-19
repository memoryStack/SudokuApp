import _noop from '@lodash/noop'
import _get from '@lodash/get'

export const getCloseDraggerHandler = ref => _get(ref, 'current.closeDragger', _noop)
