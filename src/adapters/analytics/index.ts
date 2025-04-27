import { ROUTES } from "src/navigation/route.constants";
import { ArenaAnalyticsHandlers } from "./arenaScreen";
import type { AllAnalyticsHandlers as AllAnalyticsHandlersType } from "@application/analyticsInterfaces/types";

export const AnalyticsHandlers: AllAnalyticsHandlersType = {
    [ROUTES.ARENA]: ArenaAnalyticsHandlers
}
