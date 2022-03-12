import React from 'react'
import { useWindowDimensions } from "react-native";

export const withDimensions = (WrappedComponent) => {
    const WithDimensions = React.forwardRef((props, ref) => {
        // TODO: is it window height or screen height ??
        const { width, height } = useWindowDimensions()

        // let's pass in props as "window" instead of "screen"
        return (
            <WrappedComponent
                ref={ref}
                {...props}
                windowHeight={height}
                windowWidth={width}
            />
        )
    })

    return WithDimensions
}
