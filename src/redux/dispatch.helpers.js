let dispatch;
let getState;
let isDispatchInit = false;
let isGetStateInit = false;

export const initDispatch = (storeDispatch) => {
    dispatch = storeDispatch;
    isDispatchInit = true;
};

export const invokeDispatch = (action) => {
    if (!isDispatchInit) throw new Error('Dispatch init not done!');
    dispatch(action);
};

export const initGetState = (getStoreState) => {
    getState = getStoreState;
    isGetStateInit = true;
};

export const getStoreState = () => {
    if (!isGetStateInit) throw new Error('Get State init not done!');
    return getState();
};
