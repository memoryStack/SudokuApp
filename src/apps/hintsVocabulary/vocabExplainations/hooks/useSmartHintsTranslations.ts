import { useMemo } from 'react'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { getHintExplanationTexts, getHintsTitle } from 'src/apps/arena/utils/smartHints/stringLiterals'
import { SmartHintsTranslationsTexts } from 'src/apps/arena/utils/smartHints/types'

export const useSmartHintsTranslations = (): SmartHintsTranslationsTexts => {
    const { t: tSmartHints, i18n } = useTranslation('smartHints')
    const { t: tTryOutAnalyser } = useTranslation('tryOutAnalyser')

    const smartHintsTranslationsTexts = useMemo(() => {
        return {
            explanation: getHintExplanationTexts(tSmartHints),
            title: getHintsTitle(tSmartHints),
            common: i18n.getDataByLanguage(i18n.language)?.['common'] ?? {},
            tryOutAnalyser: i18n.getDataByLanguage(i18n.language)?.['tryOutAnalyser'] ?? {},
        }
    }, [tSmartHints, tTryOutAnalyser, i18n])

    return smartHintsTranslationsTexts
}
