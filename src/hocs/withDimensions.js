import React from 'react'
import { useWindowDimensions } from "react-native";

export const withDimensions = (WrappedComponent) => {
    const WithActions = (props) => {
        // TODO: is it window height or screen height ??
        const { width, height } = useWindowDimensions()

        // let's pass in props as "window" instead of "screen"
        return (
            <WrappedComponent
                windowHeight={height}
                windowWidth={width}
                {...props}
            />
        )
    }
    return WithActions
}
