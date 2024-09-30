import { createSlice } from "@reduxjs/toolkit"; 

const initialState = { 
  darkMode: localStorage.getItem("darkMode") !== null
    ? JSON.parse(localStorage.getItem("darkMode"))
    : true
};

const modeSlice = createSlice({
  name: "mode",
  initialState: initialState,
  reducers: {
    setMode(state, action) { // First parameter is state, second is action
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', state.darkMode);
    }
  }
});

export const { setMode } = modeSlice.actions;
export default modeSlice.reducer;
