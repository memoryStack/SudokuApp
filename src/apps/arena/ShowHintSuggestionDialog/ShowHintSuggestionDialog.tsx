import React from 'react'

import { View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './showHintSuggestionDialog.styles'
import Dialog from '@ui/molecules/Dialog'
import { BUTTON_TYPES } from '@ui/molecules/Button'

import LottieView from 'lottie-react-native';

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

    const languagesOptionsView = <LottieView
        style={styles.animationContainer}
        source={require('./animations/hintAnimation.lottie')}
        autoPlay
        loop
    />

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
