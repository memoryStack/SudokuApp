import * as React from 'react';
import type { ViewStyle } from 'react-native';

interface SnackbarState {
    visible: boolean;
    message: string;
    containerStyle?: ViewStyle;
}

export const useSnackbar = (autoHideDuration: number = 5000) => {
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({
        visible: false,
        message: '',
    });
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const showSnackbar = React.useCallback((message: string, containerStyle?: ViewStyle) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSnackbarState({
            visible: true,
            message,
            containerStyle,
        });

        timeoutRef.current = setTimeout(() => {
            setSnackbarState((prev) => ({ ...prev, visible: false, containerStyle: undefined }));
        }, autoHideDuration);
    },
        [autoHideDuration]
    );

    const hideSnackbar = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setSnackbarState((prev) => ({ ...prev, visible: false, containerStyle: undefined }));
    }, []);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        snackbarState,
        showSnackbar,
        hideSnackbar,
    };
};
