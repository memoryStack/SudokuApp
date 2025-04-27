import { ROUTES } from "@application/constants"

export type HintVisibleEventData = {
    hint: string,
    level: string,
    puzzle: string,
}

export type PuzzleLifeCycleEvent = {
    puzzle: string,
    level: string,
    status: string,
}

export type ArenaAnalyticsHandler = {
    sendSmartHintVisibleEvent: (data: HintVisibleEventData) => void,
    sendPuzzleLifeCycleEvent: (data: PuzzleLifeCycleEvent) => void,
}

type HomeAnalyticsHandlers = {}

export type ScreenAnalyticsHandlers = ArenaAnalyticsHandler | HomeAnalyticsHandlers

// export type AllAnalyticsHandlers = {
//     [key: ROUTES]: ScreenAnalyticsHandlers
// }

export type AllAnalyticsHandlers = Partial<Record<ROUTES, ScreenAnalyticsHandlers>>
// {
//     [key: ROUTES]: ScreenAnalyticsHandlers
// }
