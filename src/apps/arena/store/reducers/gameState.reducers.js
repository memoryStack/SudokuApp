import { createSlice } from "@reduxjs/toolkit";

import { INITIAL_STATE } from "../state/gameState.state";
import stateHandlers from "../stateHandlers/gameState.stateHandlers";

// TODO: comeup with a good name for "gameState"
export const gameStateSlice = createSlice({
  name: "gameState",
  initialState: INITIAL_STATE,
  reducers: stateHandlers,
});

export default gameStateSlice.reducer;

export const { setGameState } = gameStateSlice.actions;
