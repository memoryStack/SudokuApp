export interface SnackBarAdapter {
    show: (
        msg: string,
        visibleTime?: number, // in milliseconds,
    ) => void;
}
