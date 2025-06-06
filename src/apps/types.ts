import { ViewStyle, TextStyle, ImageStyle, StyleSheet } from 'react-native';

export type StyleSheetObject = {
    [key: string]: ViewStyle | TextStyle | ImageStyle;
};
