import uuid from 'react-native-uuid';

import type { PausedGameData, GamePersistenceAdapter, GameDataToPersist } from '@application/adapterInterfaces/gamePersistenceAdapter'
import _isEmpty from '@lodash/isEmpty'
import { getKey, setKey } from '@utils/storage'
import { GAME_DATA_KEYS, PREVIOUS_GAME_DATA_KEY } from 'src/apps/arena/utils/cacheGameHandler'

type UserDetails = {
    id: string
}

type UserDetailsAdapter = {
    getUserId: () => Promise<UserDetails['id']>
}

/*
    this function will know the format in which data is stored in persistence
    layer and in which format is it needed by the application layer
*/

const USER_DETAILS_KEY = 'USER_DETAILS_KEY'

const setUserId = async (id: UserDetails['id']) => {
    const userDetails = await getKey<UserDetails>(USER_DETAILS_KEY)
    return setKey(PREVIOUS_GAME_DATA_KEY, {
        ...userDetails,
        id
    })
}

const getUserId = async (): Promise<UserDetails['id']> => {
    const userDetails = await getKey<UserDetails>(USER_DETAILS_KEY)
    if (userDetails) return userDetails.id
    const id = uuid.v4() as UserDetails['id']
    await setUserId(id)
    return id
}

export const userDetailsAdapter: UserDetailsAdapter = {
    getUserId
}
