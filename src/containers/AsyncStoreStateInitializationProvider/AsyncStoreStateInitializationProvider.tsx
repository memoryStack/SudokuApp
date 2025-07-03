import React, { createContext, useEffect } from 'react'

import { useDispatch } from 'react-redux';

import { fetchRefreeDataFromFromLocalStorage } from 'src/apps/arena/store/reducers/refree.reducers';

type Props = {
    children: React.ReactNode
}

const AsyncStoreStateInitializationContext = createContext(undefined)

const AsyncStoreStateInitializationProvider: React.FC<Props> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRefreeDataFromFromLocalStorage());
    }, [dispatch]);

    return (
        <AsyncStoreStateInitializationContext.Provider value={undefined}>
            {children}
        </AsyncStoreStateInitializationContext.Provider>
    )
}

export default React.memo(AsyncStoreStateInitializationProvider)
