import { getTextConfig, getLinkTagSubstr, getLinkTagData } from './ExperimentalText'

describe('getTextConfig()', () => {
    // TODO: what if link's format is wrong itself.
    // what to do ??
    test('when link is in middle', () => {
        const text = "Please visit <a pageRouteKey=#somepage#>here</a>."

        const expectedResult = [
            { text: 'Please visit ', isLink: false, },
            { text: 'here', isLink: true, routeKey: 'somepage' },
            { text: '.', isLink: false, }
        ]
        expect(getTextConfig(text)).toStrictEqual(expectedResult)
    })

    test('when whole text the link', () => {
        const text = "<a pageRouteKey=#somepage#>here</a>"

        const expectedResult = [{ text: 'here', isLink: true, routeKey: 'somepage' }]
        expect(getTextConfig(text)).toStrictEqual(expectedResult)
    })

    test('when text ends with link', () => {
        const text = "visit <a pageRouteKey=#somepage#>here</a>"

        const expectedResult = [
            { text: 'visit ', isLink: false },
            { text: 'here', isLink: true, routeKey: 'somepage' }
        ]
        expect(getTextConfig(text)).toStrictEqual(expectedResult)
    })

    test('when text has multiple links', () => {
        const text = "<a pageRouteKey=#somepage#>link a</a> and <a pageRouteKey=#somepage#>link b</a>"

        const expectedResult = [
            { text: 'link a', isLink: true, routeKey: 'somepage' },
            { text: ' and ', isLink: false },
            { text: 'link b', isLink: true, routeKey: 'somepage' }
        ]
        expect(getTextConfig(text)).toStrictEqual(expectedResult)
    })
})

describe('getLinkTagSubstr()', () => {
    test('returns link tag substring once the index of opening tag is given', () => {
        const text = "Please visit <a pageRouteKey=#somepage#>here</a>."
        const expectedResult = '<a pageRouteKey=#somepage#>here</a>'
        expect(getLinkTagSubstr(13, text)).toStrictEqual(expectedResult)
    })

    test('returns current link tag onlu', () => {
        const text = "Please visit <a pageRouteKey=#somepage#>here</a>.djk <a>sfjh</a>"
        const expectedResult = '<a pageRouteKey=#somepage#>here</a>'
        expect(getLinkTagSubstr(13, text)).toStrictEqual(expectedResult)
    })
})

describe('getLinkTagData()', () => {
    test('returns extracted link text and routeKey to which click should redirect', () => {
        const tag = '<a pageRouteKey=#somepage#>here</a>'
        const expectedResult = { text: 'here', routeKey: 'somepage' }
        expect(getLinkTagData(tag)).toStrictEqual(expectedResult)
    })
})