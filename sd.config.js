const fs = require('fs')

// eslint-disable-next-line import/no-extraneous-dependencies
const StyleDictionary = require('style-dictionary')

StyleDictionary.registerTransform({
    name: 'color/opacity/transformer',
    type: 'value',
    transitive: true,
    matcher: ({ type }) => type === 'colorOpacity',
    transformer: ({ value }) => parseInt(value.substr(0, 3), 10),
})

const STYLE_DICTIONARY_CONFIG = {
    source: ['./src/designSystem/**/*.js'],
    platforms: {
        rn: {
            transformGroup: 'react-native',
            isGlobal: true,
            transforms: [
                'color/opacity/transformer',
            ],
            buildPath: './src/designSystem/',
            files: [
                {
                    destination: 'tokens.json',
                    format: 'json/nested',
                    name: 'Tokens',
                    filter(token) { return !token.isCore },
                },
            ],
        },
    },
}

const sd = StyleDictionary.extend(STYLE_DICTIONARY_CONFIG)

sd.buildAllPlatforms()

const formatTokensForNavigationContainer = () => {
    // NavigationContainer needs a property like "color.background"
    // to work proporly in theme, so all this deleting, renaming properties
    // is done just for the sake of that
    fs.readFile('src/designSystem/tokens.json', 'utf8', (err, data) => {
        if (err) throw err
        const dataObj = JSON.parse(data)
        dataObj.dark = false

        dataObj.colors['internal-background'] = dataObj.colors.background
        dataObj.colors['internal-on-background'] = dataObj.colors['on-background']
        dataObj.colors.background = 'rgb(242, 242, 242)'
        delete dataObj.colors['on-background']

        fs.writeFile('src/designSystem/tokens.json', JSON.stringify(dataObj), err => {
            if (err) throw err
        })
    })
}

formatTokensForNavigationContainer()
