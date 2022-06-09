import { ACTION_HANDLERS as SMART_HINT_ACTION_HANDLERS } from '../smartHintHC/actionHandlers'

import { ACTION_HANDLERS } from './actionHandlers'
import { SMART_HINT_TRY_OUT_ACTION_PROP_NAME } from './constants'

export const ACTION_HANDLERS_CONFIG = [
    {
        actionHandlers: ACTION_HANDLERS,
    },
    {
        onActionPropAlias: SMART_HINT_TRY_OUT_ACTION_PROP_NAME,
        actionHandlers: SMART_HINT_ACTION_HANDLERS,
    },
]
