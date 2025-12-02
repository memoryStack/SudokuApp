styles
    don't use hex or any hard coded color values as a fallback. always pick
    values from theme tokens

    don't use styles like below to texts to style the texts. we have a Text component
    in @ui folder that already applied these fontSize, lineHeight related styles
    based on the text variation
    ..._get(theme, ['typography', 'body', 'medium'], {}),

platform 
    for platform related checks like Platform.OS === 'ios' or Platform.OS === 'android'
    use the utild from Platform class written in src/utils/classes/platform.js

