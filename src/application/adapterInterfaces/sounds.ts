export interface SoundAdapter {
    init: () => Promise<void>
    play: (sound: SOUNDS) => Promise<void>
}

export enum SOUNDS {
    CELL_CLICK = 'CELL_CLICK',
    ERASER_CLICK = 'ERASER_CLICK',
    NUMBER_INPUT = 'NUMBER_INPUT',
    MISTAKE = 'MISTAKE',
    GAME_OVER = 'GAME_OVER',
    GAME_SOLVED = 'GAME_SOLVED',
}

export interface Sound {
    play(): Promise<void>;
}
