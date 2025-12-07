import React from 'react'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../../i18n/hooks/useTranslation'

import { getStyles } from './showHintSuggestionDialog.styles'
import Dialog from '@ui/molecules/Dialog'
import { BUTTON_TYPES } from '@ui/molecules/Button'

import LottieView from 'lottie-react-native';
import { HINT_SUGGESTION_DIALOG_TEST_ID } from './showHintSuggestionDialog.constants'

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
    const { t } = useTranslation('arena')

    const languagesOptionsView = <LottieView
        style={styles.animationContainer}
        source={require('./animations/hintAnimation.lottie')}
        autoPlay
        loop
    />

    return (
        <Dialog
            testID={HINT_SUGGESTION_DIALOG_TEST_ID}
            title={t('hintSuggestion.title', 'Want Help?')}
            description={description}
            body={languagesOptionsView}
            footerButtonsConfig={[
                {
                    label: t('common:dontShowAgain', "Don't show again"),
                    onClick: onSnoozeClick,
                },
                {
                    label: t('common:yes', 'Yes'),
                    onClick: onConfirmClick,
                    type: BUTTON_TYPES.FILLED,
                },
            ]}
        />
    )
}

export default React.memo(ShowHintSuggestionDialog)
