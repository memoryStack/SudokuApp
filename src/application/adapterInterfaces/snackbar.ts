// customStyles argument is going to be a style object who's type might 
// be in React (framework). isn't this a violation of DIP rule ??

type SnackBarData = {
    msg: string,
    visibleTime?: number, // in milliseconds
    customStyles?: {} | null
}

export interface SnackBarAdapter {
    show: ({ msg, visibleTime, customStyles }: SnackBarData) => void;
}
