import React from 'react'

import { View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './showHintSuggestionDialog.styles'
import Dialog from '@ui/molecules/Dialog'
import { BUTTON_TYPES } from '@ui/molecules/Button'

type Props = {
    description: string,
    onSnoozeClick: () => void,
    onConfirmClick: () => void,
}
const ShowHintSuggestionDialog: React.FC<Props> = ({
    description,
    onSnoozeClick,
    onConfirmClick,
}) => {
    const styles = useStyles(getStyles)

    const languagesOptionsView = <View style={{ width: 100, backgroundColor: 'red', height: 100 }}></View>

    return (
        <Dialog
            title={'Want Help?'}
            description={description}
            body={languagesOptionsView}
            footerButtonsConfig={[
                {
                    label: "Don't show again",
                    onClick: onSnoozeClick,
                },
                {
                    label: 'Yes',
                    onClick: onConfirmClick,
                    type: BUTTON_TYPES.FILLED,
                },
            ]}
        />
    )
}

export default React.memo(ShowHintSuggestionDialog)
