import React, { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'

import { CopilotStep } from "react-native-copilot";

import _noop from '@lodash/noop'

import { HintIcon } from '@resources/svgIcons/hint'

import Badge from '@ui/atoms/Badge'
import Text from '@ui/atoms/Text'
import Tooltip, { usePopable } from '@ui/atoms/Tooltip'

import { useStyles } from '@utils/customHooks/useStyles'
import { Touchable } from '../../../components/Touchable'

import { getStyles } from '../cellActions.styles'
import { shouldShowHintsMenuTooltip } from '@application/usecases/smartHint/smartHint';
import { useDependency } from 'src/hooks/useDependency';

// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their
// comfort and confidence level

// const copilotText = "Now press on \"Hint\"\n\nApp will use notes filled in previous step to find hints in puzzle"
const copilotText = "Now press on \"Hint\""

const Hint = ({
    iconBoxSize, hints, onClick, disabled, ...rest
}) => {
    const styles = useStyles(getStyles)

    const { ref: tooltipRef, hide, show } = usePopable()
    const hintsMenuTooltipShown = useRef(false)
    const dependencies = useDependency()

    useEffect(() => {
        if (hintsMenuTooltipShown.current) return
        setTimeout(() => {
            shouldShowHintsMenuTooltip(dependencies).then(async (shouldShow) => {
                if (shouldShow) {
                    hintsMenuTooltipShown.current = true
                    show()
                    // it would be nice to have auto hide
                    setTimeout(hide, 8000)
                    const {
                        coachMarksAdapter,
                        analytics
                    } = dependencies
                    await coachMarksAdapter?.increaseHintsMenuTooltipShownCount?.()
                    analytics?.sendHintsMenuTooltipShownEvent?.({
                        count: await coachMarksAdapter?.getHintsMenuTooltipCount?.()
                    })
                }
            })
        }, 3000)
    }, [])

    const renderHintsCount = () => {
        if (disabled || true) return null
        return <Badge label={hints} />
    }

    const renderIcon = () => (
        <>
            <HintIcon iconBoxSize={iconBoxSize} fill={styles.inactiveState.color} />
            {renderHintsCount()}
        </>
    )

    const noAvailableHints = hints === 0

    const showAllHint = () => {
        onClick(true)
    }

    const showOnlyOneHint = () => {
        onClick(false)
    }

    return (
        <CopilotStep
            name="clickHints"
            text={copilotText}
            order={2}
        >
            <Touchable
                style={styles.actionContainer}
                onPress={showOnlyOneHint}
                onLongPress={showAllHint}
                disabled={disabled || noAvailableHints}
                {...rest}
            >
                <Tooltip ref={tooltipRef} content={"Long press to see all hints"} position={"top"}>
                    {/* have to wrap a new Touchable due to tooltip addition */}
                    <Touchable onPress={showOnlyOneHint} onLongPress={showAllHint}>
                        {renderIcon()}
                    </Touchable>
                </Tooltip>
                <Text style={styles.actionText}>Hint</Text>
            </Touchable>
        </CopilotStep>
    )
}

export default React.memo(Hint)

Hint.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    hints: PropTypes.number,
    disabled: PropTypes.bool,
}

Hint.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    hints: 0,
    disabled: false,
}
