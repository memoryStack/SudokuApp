const interpolationPattern = /{{(.*?)}}/g;

export const dynamicInterpolation = (template = '', values = {}, pattern = interpolationPattern) => {
    return template.replace(pattern, (match, key) => values[key]);
}
