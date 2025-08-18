import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { INITIAL_STATE } from '../state/refree.state'
import stateHandlers from '../stateHandlers/refree.stateHandlers'
import { gameSettingsAdapter } from '@adapters/gameSettings';
import _isNil from '@lodash/isNil';

export const fetchRefreeDataFromFromLocalStorage = createAsyncThunk(
    'refree/fetchData',
    async (params, { rejectWithValue }) => {
        try {
            const mistakesLimit = gameSettingsAdapter.getMistakesLimit()
            return mistakesLimit
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createRefreeStateSlice = (sliceName = 'refree') => {
    return createSlice({
        name: sliceName,
        initialState: INITIAL_STATE,
        reducers: stateHandlers,
        extraReducers: (builder) => {
            builder
                .addCase(fetchRefreeDataFromFromLocalStorage.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchRefreeDataFromFromLocalStorage.fulfilled, (state, action) => {
                    state.loading = false;
                    // it will never be 0 as it doesn't make sense
                    if (!_isNil(action.payload)) {
                        state.maxMistakesLimit = action.payload
                    }
                })
                .addCase(fetchRefreeDataFromFromLocalStorage.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                });
        },
    })
}

const refreeSlice = createRefreeStateSlice()

export default refreeSlice.reducer

export const refreeActions = refreeSlice.actions
