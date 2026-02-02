import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { COACHMARKS } from '@application/adapterInterfaces/coachMarks'
import type { Dependencies } from '@application/type'
import { inAppReviewAdapter } from 'src/adapters/inAppReviewAdapter'
import {
    CUSTOMIZE_EXPERIENCE_TOOLTIP_ID,
    CUSTOMIZE_EXPERIENCE_TOOLTIP_IDS,
    MIN_GAMES_SOLVED_FOR_TOOLTIP,
} from '../home.constants'

export type CustomizeExperienceTooltipResult = {
    show: boolean
    message: string
    tooltipId: string | null
    markShown: () => Promise<void>
}

const getTranslationKey = (tooltipId: string) =>
    `coachmarks.customizeExperience.${tooltipId}`

/** Default messages (English) used when translation is missing. */
const DEFAULT_TOOLTIP_MESSAGES: Record<string, string> = {
    [CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE]:
        'Want Dark Mode?\nCheckout "Customize Experience" here',
    [CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NOTES_WITHOUT_PENCIL]:
        'Want to fill notes without turning pencil on/off?\nCheckout "Fill Numbers" in Customize Experience.',
    [CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SHOW_FEEDBACK_ON_MISTAKE]:
        'Annoyed by red warnings on making mistakes?\nCheckout "Visual Highlights" in Customize Experience.',
    [CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SOUNDS_ENABLED]:
        'Want to play in silent mode?\nCheckout "Sounds" in Customize Experience.',
    [CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NUMBER_ON_CELL_CLICK]:
        'Want to fill a number quickly on just cell tap?\nCheckout "Fill Numbers" in Customize Experience.',
}

/**
 * For each tooltip we show only when the user has NOT already enabled the behavior
 * (except showFeedbackOnMistake and soundsEnabled: we show when they HAVE it on
 * so we can suggest turning off).
 * Returns true if the setting already "confirms" the behavior (user doesn't need this tip).
 */
function settingAlreadyConfirmsBehavior(
    tooltipId: string,
    gameSettingsAdapter: Dependencies['gameSettingsAdapter']
): boolean {
    switch (tooltipId) {
        case CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE:
            return gameSettingsAdapter?.isDarkMode?.() === true
        case CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NOTES_WITHOUT_PENCIL:
            return gameSettingsAdapter?.fillNotesWithoutPencil?.() === true
        case CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SHOW_FEEDBACK_ON_MISTAKE:
            return gameSettingsAdapter?.showFeedbackOnMistake?.() === false
        case CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SOUNDS_ENABLED:
            return gameSettingsAdapter?.soundsEnabled?.() === false
        case CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NUMBER_ON_CELL_CLICK:
            return gameSettingsAdapter?.fillNumberOnCellClick?.() === true
        default:
            return true
    }
}

export function useCustomizeExperienceTooltip(
    dependencies: Dependencies | null
): CustomizeExperienceTooltipResult {
    const { t } = useTranslation('home')
    const [result, setResult] = useState<{
        show: boolean
        message: string
        tooltipId: string | null
    }>({ show: false, message: '', tooltipId: null })

    const markShown = useCallback(async () => {
        setResult({ show: false, message: '', tooltipId: null })
    }, [])

    useEffect(() => {
        if (!dependencies) return
        const { coachMarksAdapter, gameSettingsAdapter } = dependencies

        if (coachMarksAdapter.isCoachmarkShownInSession(COACHMARKS.CUSTOMIZE_EXPERIENCE_TOOLTIP)) {
            return
        }

        const run = async () => {
            const gamesSolved = await inAppReviewAdapter.getGamesSolvedCount()
            if (gamesSolved == null || gamesSolved < MIN_GAMES_SOLVED_FOR_TOOLTIP) {
                return
            }

            const state = await coachMarksAdapter.getCustomizeExperienceTooltipState()
            const knownSet = new Set(state.knownTooltipIds)

            for (const tooltipId of CUSTOMIZE_EXPERIENCE_TOOLTIP_IDS) {
                if (knownSet.has(tooltipId)) continue

                if (settingAlreadyConfirmsBehavior(tooltipId, gameSettingsAdapter)) {
                    await coachMarksAdapter.markCustomizeExperienceTooltipKnown(tooltipId)
                    knownSet.add(tooltipId)
                    continue
                }

                const defaultMessage = DEFAULT_TOOLTIP_MESSAGES[tooltipId] ?? ''
                const message = t(getTranslationKey(tooltipId), defaultMessage)
                setResult({ show: true, message, tooltipId })
                await coachMarksAdapter.markCustomizeExperienceTooltipKnown(tooltipId)
                coachMarksAdapter.markCustomizeExperienceTooltipShownInSession()
                return
            }
        }

        run()
    }, [])

    return {
        show: result.show,
        message: result.message,
        tooltipId: result.tooltipId,
        markShown,
    }
}
