// const Color = require('color')

// // we will make out palettes using this algorithm
// // take hue and chroma from themebuilder (https://m3.material.io/theme-builder#/custom)
// // and just change the lightness as per the variant is required

// const color = Color({ r: 97, g: 93, b: 103 }).hex()
// console.log(color)

// const lightnessList = [10, 20, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99]
// const result = {}
// lightnessList.forEach(lightnessVale => {
//     const color = Color({
//         h: 27.40, // originalcolors.color[0],
//         s: 113.35, // originalcolors.color[1],
//         l: lightnessVale,
//     })
//     result[lightnessVale] = {
//         value: color.hex(),
//         isCore: true,
//     }
//     // console.log(`color: ${colors.hex()}; // lightness value is ${lightnessVale}`)
// })
// console.log(result)

module.exports = {
    colors: {
        white: { value: '#FFFFFF', isCore: true },
        black: {
            value: '#000000',
            isCore: true,
        },
        primary: {
            0: {
                value: '{colors.black}',
                isCore: true,
            },
            10: {
                value: '#21005D',
                isCore: true,
            },
            20: {
                value: '#381E72',
                isCore: true,
            },
            30: {
                value: '#4F378B',
                isCore: true,
            },
            40: {
                value: '#6750A4',
                isCore: true,
            },
            50: {
                value: '#7F67BE',
                isCore: true,
            },
            60: {
                value: '#9A82DB',
                isCore: true,
            },
            70: {
                value: '#B69DF8',
                isCore: true,
            },
            80: {
                value: '#D0BCFF',
                isCore: true,
            },
            90: {
                value: '#EADDFF',
                isCore: true,
            },
            95: {
                value: '#F6EDFF',
                isCore: true,
            },
            99: {
                value: '#FFFBFF',
                isCore: true,
            },
            100: {
                value: '{colors.white}',
                isCore: true,
            },
        },
        secondary: {
            0: {
                value: '{colors.black}',
                isCore: true,
            },
            10: {
                value: '#1D192B',
                isCore: true,
            },
            20: {
                value: '#332D41',
                isCore: true,
            },
            30: {
                value: '#4A4458',
                isCore: true,
            },
            40: {
                value: '#625B71',
                isCore: true,
            },
            50: {
                value: '#7A7289',
                isCore: true,
            },
            60: {
                value: '#958DA5',
                isCore: true,
            },
            70: {
                value: '#B0A7C0',
                isCore: true,
            },
            80: {
                value: '#CCC2DC',
                isCore: true,
            },
            90: {
                value: '#E8DEF8',
                isCore: true,
            },
            95: {
                value: '#F6EDFF',
                isCore: true,
            },
            99: {
                value: '#FFFBFF',
                isCore: true,
            },
            100: {
                value: '{colors.white}',
                isCore: true,
            },
        },
        tertiary: {
            0: {
                value: '{colors.black}',
                isCore: true,
            },
            10: {
                value: '#31111D',
                isCore: true,
            },
            20: {
                value: '#492532',
                isCore: true,
            },
            30: {
                value: '#633B48',
                isCore: true,
            },
            40: {
                value: '#7D5260',
                isCore: true,
            },
            50: {
                value: '#986977',
                isCore: true,
            },
            60: {
                value: '#B58392',
                isCore: true,
            },
            70: {
                value: '#D29DAC',
                isCore: true,
            },
            80: {
                value: '#EFB8C8',
                isCore: true,
            },
            90: {
                value: '#FFD8E4',
                isCore: true,
            },
            95: {
                value: '#FFECF1',
                isCore: true,
            },
            99: {
                value: '#FFFBFA',
                isCore: true,
            },
            100: {
                value: '{colors.white}',
                isCore: true,
            },
        },
        neutral: {
            0: { value: '{colors.black}', isCore: true },
            10: { value: '#1B171C', isCore: true },
            20: { value: '#372F37', isCore: true },
            30: { value: '#524653', isCore: true },
            40: { value: '#6E5E6E', isCore: true },
            50: { value: '#89758A', isCore: true },
            60: { value: '#A191A1', isCore: true },
            70: { value: '#B8ACB9', isCore: true },
            80: { value: '#D0C8D0', isCore: true },
            87: { value: '#E0DBE1', isCore: true },
            90: { value: '#E7E3E8', isCore: true },
            92: { value: '#ECE9EC', isCore: true },
            94: { value: '#F1EEF1', isCore: true },
            95: { value: '#F3F1F3', isCore: true },
            96: { value: '#F6F4F6', isCore: true },
            98: { value: '#FAF9FA', isCore: true },
            99: { value: '#FDFCFD', isCore: true },
            100: { value: '{colors.white}', isCore: true },
        },
        'neutral-variant': {
            0: {
                value: '{colors.black}',
                isCore: true,
            },
            10: {
                value: '#1D1A22',
                isCore: true,
            },
            20: {
                value: '#332F37',
                isCore: true,
            },
            30: {
                value: '#49454F',
                isCore: true,
            },
            40: {
                value: '#605D66',
                isCore: true,
            },
            50: {
                value: '#79747E',
                isCore: true,
            },
            60: {
                value: '#938F99',
                isCore: true,
            },
            70: {
                value: '#AEA9B4',
                isCore: true,
            },
            80: {
                value: '#CAC4D0',
                isCore: true,
            },
            90: {
                value: '#E7E0EC',
                isCore: true,
            },
            95: {
                value: '#F5EEFA',
                isCore: true,
            },
            99: {
                value: '#FFFBFE',
                isCore: true,
            },
            100: {
                value: '{colors.white}',
                isCore: true,
            },
        },
        error: {
            0: { value: '{colors.black}', isCore: true },
            10: { value: '#331700', isCore: true },
            20: { value: '#662F00', isCore: true },
            30: { value: '#994600', isCore: true },
            40: { value: '#CC5D00', isCore: true },
            50: { value: '#FF7400', isCore: true },
            60: { value: '#FF9033', isCore: true },
            70: { value: '#FFAC66', isCore: true },
            80: { value: '#FFC899', isCore: true },
            87: { value: '#FFDBBD', isCore: true },
            90: { value: '#FFE3CC', isCore: true },
            92: { value: '#FFE9D6', isCore: true },
            94: { value: '#FFEEE0', isCore: true },
            95: { value: '#FFF1E5', isCore: true },
            96: { value: '#FFF4EB', isCore: true },
            98: { value: '#FFF9F5', isCore: true },
            99: { value: '#FFFCFA', isCore: true },
            100: { value: '{colors.white}', isCore: true },
        },
    },
}
