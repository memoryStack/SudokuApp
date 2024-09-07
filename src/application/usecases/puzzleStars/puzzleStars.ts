import _isNil from "@lodash/isNil"
import { NEW_GAME_IDS } from "../newGameMenu/constants"
import { isGenerateNewPuzzleItem } from "../newGameMenu/newGameMenu"
import { PUZZLE_STARS_DISTRIBUTION } from "./constants"
import { StarsAndTimeLimit, Time } from "./type"

const convertTimeToSeconds = (time: Time) => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds
}

export const getPuzzleAvailableStars = ({
    time,
    puzzleType
}: {
    time: Time,
    puzzleType: NEW_GAME_IDS
}) => {
    if (!isGenerateNewPuzzleItem(puzzleType) || _isNil(time)) return 0

    const puzzleStarsDistribution: StarsAndTimeLimit[] = PUZZLE_STARS_DISTRIBUTION[puzzleType]

    return puzzleStarsDistribution.find((item: StarsAndTimeLimit) => {
        const starsTimeLimit: Time = { hours: 0, minutes: item.timeLimit, seconds: 0 }
        return convertTimeToSeconds(starsTimeLimit) > convertTimeToSeconds(time)
    })?.stars
}
