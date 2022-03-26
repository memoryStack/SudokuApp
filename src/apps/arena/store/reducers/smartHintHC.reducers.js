import { createSlice } from "@reduxjs/toolkit";

import { INITIAL_STATE } from "../state/smartHintHC.state";
import stateHandlers from "../stateHandlers/smartHintHC.stateHandlers";

export const smartHintHCSlice = createSlice({
  name: "smartHintHC",
  initialState: INITIAL_STATE,
  reducers: stateHandlers,
});

export default smartHintHCSlice.reducer;

export const {
    setHints,
    removeHints,
    setNextHint,
    setPrevHint,
} = smartHintHCSlice.actions;
