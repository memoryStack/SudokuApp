import { consoleLog } from '@utils/util';
import { ArenaServiceAdapterInterface } from 'src/interfaces/arenaServiceAdapter'

const hostname = "http://52.66.253.10:3000";

export const ArenaServiceAdapter: ArenaServiceAdapterInterface = {
    getUserFamiliarWithHints: async (data) => {
        try {
            const response = await fetch(`${hostname}/userFamiliarWithHints/${data.userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // ← Critical header
                    'Accept': 'application/json',       // ← Optional but good practice
                },
            });
            if (!response.ok) return false

            const { isFamiliar } = await response.json();

            return !!isFamiliar
        } catch (error) {
            // throw error;
            console.log('@@@@@ error', error)
        }
        return false
    },
}
