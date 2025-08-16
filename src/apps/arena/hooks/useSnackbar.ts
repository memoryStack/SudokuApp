import * as React from 'react';

interface SnackbarState {
    visible: boolean;
    message: string;
}

export const useSnackbar = (autoHideDuration: number = 5000) => {
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({
        visible: false,
        message: '',
    });
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const showSnackbar = React.useCallback((message: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSnackbarState({
            visible: true,
            message,
        });

        timeoutRef.current = setTimeout(() => {
            setSnackbarState((prev) => ({ ...prev, visible: false }));
        }, autoHideDuration);
    },
        [autoHideDuration]
    );

    const hideSnackbar = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setSnackbarState((prev) => ({ ...prev, visible: false }));
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
