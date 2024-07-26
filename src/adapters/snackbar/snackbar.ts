import type { SnackBarAdapter as SnackBarInterface } from '@application/adapterInterfaces/snackbar'

import { emit } from '@utils/GlobalEventBus'

import { EVENTS } from 'src/constants/events'

export const snackBarAdapter: SnackBarInterface = {
    show: ({ msg = '', visibleTime, customStyles = null }) => {
        emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
            msg: msg,
            visibleTime,
            customStyles,
        })
    }
}
