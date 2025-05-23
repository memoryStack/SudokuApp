
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
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
}
