const interpolationPattern = /{{(.*?)}}/g

export const dynamicInterpolation = (template = '', values = {}, pattern = interpolationPattern) => {
    if (typeof template !== 'string') return ''

    return template.replace(pattern, (match, key) => values[key] || match)
}
