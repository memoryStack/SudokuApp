const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    resolver: {
        assetExts: [
            // Image formats
            'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico',
            // Video/Audio
            'mp3', 'mp4', 'm4a', 'wav', 'ogg', 'mov', 'avi',
            // Fonts
            'ttf', 'otf', 'woff', 'woff2',
            // Data files
            'json', 'xml', 'plist',
            // Misc
            'db', 'zip',
            'lottie', // Explicitly add .lottie extension
        ],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
