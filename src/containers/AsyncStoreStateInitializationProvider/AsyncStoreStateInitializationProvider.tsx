import DependencyContext from '@contexts/DependencyContext';
import React, { createContext, useContext, useEffect } from 'react'

import { useDispatch } from 'react-redux';

import { fetchRefreeDataFromFromLocalStorage } from 'src/apps/arena/store/reducers/refree.reducers';

type Props = {
    children: React.ReactNode
}

const AsyncStoreStateInitializationContext = createContext(undefined)

const AsyncStoreStateInitializationProvider: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch();

    const { state: { gameSettingsInitialized } } = useContext(DependencyContext)

    useEffect(() => {
        if (!gameSettingsInitialized) return
        dispatch(fetchRefreeDataFromFromLocalStorage());
    }, [dispatch, gameSettingsInitialized]);

    return (
        <AsyncStoreStateInitializationContext.Provider value={undefined}>
            {gameSettingsInitialized ? children : null}
        </AsyncStoreStateInitializationContext.Provider>
    )
}

export default React.memo(AsyncStoreStateInitializationProvider)
