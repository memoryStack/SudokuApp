import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import withActions from '../../../utils/hocs/withActions'
import { Inputpanel as CoreInputPanel } from '../inputPanel'
import { getMainNumbers } from '../store/selectors/board.selectors'
import { ACTION_HANDLERS } from './actionHandlers'

const InputPanel_ = ({ onAction }) => {
    // TODO: add support for numbers which will be visible
    return <CoreInputPanel onAction={onAction} />
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(InputPanel_))
