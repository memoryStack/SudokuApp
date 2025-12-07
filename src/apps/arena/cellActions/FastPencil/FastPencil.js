import React from 'react'

import PropTypes from 'prop-types'

import { CopilotStep } from "react-native-copilot";

import _noop from '@lodash/noop'

import { PencilIcon } from '@resources/svgIcons/pencil'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../../../i18n/hooks/useTranslation'
import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'

const FastPencil = ({ iconBoxSize, onClick, textStyles, ...rest }) => {
    const styles = useStyles(getStyles)
    const { t } = useTranslation('arena')
    const copilotText = t('coachmarks.fastPencil', "To get Hints when you wish\n\nFirst press on Fast Pencil")
    return (
        <CopilotStep
            name="clickFastPencil"
            text={copilotText}
            order={1}
        >
            <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
                <PencilIcon iconBoxSize={iconBoxSize} fill={styles.inactiveState.color} />
                <Text style={[styles.actionText, textStyles]}>{t('cellActions.fastPencil', 'Fast Pencil')}</Text>
            </Touchable>
        </CopilotStep>
    )
}
export default React.memo(FastPencil)

FastPencil.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

FastPencil.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
