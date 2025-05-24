import { ROUTES } from "src/navigation/route.constants";
import { HomeAnalyticsHandlers } from "./homeScreen";
import { ArenaAnalyticsHandlers } from "./arenaScreen";
import { PlayGuideAnalyticsHandlers } from "./playGuideScreen";
import { HintsVocobularyAnalyticsHandlers } from "./hintVocabularyScreen";
import type { AllAnalyticsHandlers as AllAnalyticsHandlersType } from "@application/adapterInterfaces/analytics";

export const AnalyticsHandlers: AllAnalyticsHandlersType = {
    [ROUTES.HOME]: HomeAnalyticsHandlers,
    [ROUTES.ARENA]: ArenaAnalyticsHandlers,
    [ROUTES.PLAY_GUIDE]: PlayGuideAnalyticsHandlers,
    [ROUTES.HINTS_VOCABULARY_EXPLAINATION]: HintsVocobularyAnalyticsHandlers,
}
