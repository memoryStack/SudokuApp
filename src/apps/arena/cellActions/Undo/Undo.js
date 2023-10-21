import React from 'react'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import { UndoIcon } from '@resources/svgIcons/undo'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'

const Undo = ({ iconBoxSize, onClick, ...rest }) => {
    const styles = useStyles(getStyles)
    return (
        <Touchable style={styles.actionContainer} onPress={onClick} {...rest}>
            <UndoIcon iconBoxSize={iconBoxSize} fill={styles.inactiveState.color} />
            <Text style={styles.actionText}>Undo</Text>
        </Touchable>
    )
}
export default React.memo(Undo)

Undo.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
}

Undo.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
}
