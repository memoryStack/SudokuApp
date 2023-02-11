import { HINTS_IDS } from '../../utils/smartHints/constants'
import getRemotePairsSvgElementsConfigs from './remotePairs'

export const HINT_ID_VS_SVG_ELEMENTS_HANDLER = {
    [HINTS_IDS.REMOTE_PAIRS]: getRemotePairsSvgElementsConfigs,
}
