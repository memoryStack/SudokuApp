import _isEmpty from "@lodash/isEmpty"
import _cloneDeep from "@lodash/cloneDeep"
import _isNil from "@lodash/isNil"

import type { Dependencies } from "../../type"
import { GameState } from "@application/utils/gameState"
import { CUSTOMIZE_EXPERIENCE_TOOLTIP_SHOWN_COUNT_THRESHOLD } from "@application/adapterInterfaces/coachMarks"
import { getTimeDifferenceInSeconds } from "../smartHint/smartHint"

export const shouldShowCustomizeExperienceTooltipUseCase = async (dependencies: Dependencies) => {
    const {
        gameStateRepository,
        coachMarksAdapter,
        refreeRepository,
        smartHintRepository
    } = dependencies

    if (!new GameState(gameStateRepository.getGameState()).isGameActive() || smartHintRepository.getShowSmartHint()) return

    const timeSincePuzzleStarted = getTimeDifferenceInSeconds(
        { hours: 0, minutes: 0, seconds: 0 },
        refreeRepository.getTime()
    )

    if (timeSincePuzzleStarted < 60) return false

    return await coachMarksAdapter.getCustomizeExperienceTooltipShownCount() < CUSTOMIZE_EXPERIENCE_TOOLTIP_SHOWN_COUNT_THRESHOLD
}
