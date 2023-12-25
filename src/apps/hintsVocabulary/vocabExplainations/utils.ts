import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

export const getLinkHTMLText = (href: HINTS_VOCAB_IDS, text: string) => `<a href="${href}">${text}</a>`
