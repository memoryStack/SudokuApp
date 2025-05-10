import _forEach from '@lodash/forEach';
import Sound from 'react-native-sound';

import { SOUNDS, SoundAdapter } from "src/interfaces/soundAdapter"

interface Adapter extends SoundAdapter {
    initialized: boolean
    initializationInProgress: boolean
}

const SoundResources: Record<SOUNDS, string> = {
    [SOUNDS.CELL_CLICK]: require('@resources/sounds/cell_click.mp3'),
    [SOUNDS.ERASER_CLICK]: require('@resources/sounds/eraser_sound.mp3'),
    [SOUNDS.NUMBER_INPUT]: require('@resources/sounds/cell_click.mp3'),
    [SOUNDS.MISTAKE]: require('@resources/sounds/mistake.mp3'),
    [SOUNDS.GAME_OVER]: require('@resources/sounds/game_over.mp3'),
    [SOUNDS.GAME_SOLVED]: require('@resources/sounds/game_solved.mp3'),
}

const Sounds: Record<SOUNDS, Sound | null> = {
    [SOUNDS.CELL_CLICK]: null,
    [SOUNDS.ERASER_CLICK]: null,
    [SOUNDS.MISTAKE]: null,
    [SOUNDS.NUMBER_INPUT]: null,
    [SOUNDS.GAME_OVER]: null,
    [SOUNDS.GAME_SOLVED]: null,
}

export const soundAdapter: Adapter = {
    initialized: false,
    initializationInProgress: false,
    init: async () => {
        Sound.setCategory('Playback')
        for (const [soundKey, resource] of Object.entries(SoundResources)) {
            const sound = new Sound(resource, (error) => {
                // TODO: for some reason this callback is getting called only for success
                if (error) {
                    console.log('Failed to load sound');
                } else {
                    Sounds[soundKey as SOUNDS] = sound
                }
            });

        }
        soundAdapter.initialized = true
    },
    play: async (sound: SOUNDS) => {
        if (!soundAdapter.initialized) return
        Sounds[sound]?.play()
    }
}

soundAdapter.init()
