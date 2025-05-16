import React, { useEffect } from 'react'

import _noop from '@lodash/noop'

import withActions from '@utils/hocs/withActions'
import { ACTION_HANDLERS, ACTION_TYPES } from './updateAppDialog.actionHandlers'
import { useDependency } from 'src/hooks/useDependency'
import { OnAction } from '@utils/hocs/withActions/types'
import { useModal } from 'src/apps/arena/hooks/useModal'

type Props = {
    onAction: OnAction
    show: boolean
}

const UpdateAppDialog_: React.FC<Props> = ({ onAction }) => {
    const dependencies = useDependency()

    const modalContextValues = useModal()

    useEffect(() => {
        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: {
                dependencies,
                modalContextValues,
            }
        })
    }, [])

    return null
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(UpdateAppDialog_))
