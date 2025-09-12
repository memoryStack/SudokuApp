import { Time } from "@application/adapterInterfaces/stateManagers/refreeRepository"

export const getSmallerTime = (timeA: Time, timeB: Time) => {
    if (timeA.hours < timeB.hours) return timeA
    if (timeA.minutes < timeB.minutes) return timeA
    return (timeA.seconds < timeB.seconds) ? timeA : timeB
}
