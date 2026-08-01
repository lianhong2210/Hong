// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** Constant
import { roles } from "../../../constant/roles";

export type Typewriter = {
  roleIdx: number;
  displayed: string;
  deleting: boolean;
};

type AppCommon = {
  isAboutNameVisible: undefined | boolean;
  typewriter: Typewriter;
};

const initialState: AppCommon = {
  isAboutNameVisible: undefined,
  typewriter: {
    roleIdx: 0,
    displayed: "",
    deleting: false,
  },
};

type TypewriterAction =
  | { type: "APPEND_CHAR"; char: string }
  | { type: "DELETE_CHAR" }
  | { type: "START_DELETING" }
  | { type: "NEXT_ROLE" };

export const appCommon = createSlice({
  name: "appCommon",
  initialState: initialState,
  reducers: {
    setIsAboutNameVisible: (state, action) => {
      state.isAboutNameVisible = action.payload;
    },
    setTypewriter: (state, action) => {
      const twAction = action.payload as TypewriterAction;
      switch (twAction.type) {
        case "APPEND_CHAR":
          state.typewriter = {
            ...state.typewriter,
            displayed: state.typewriter.displayed + twAction.char,
          };
          break;
        case "DELETE_CHAR":
          state.typewriter = {
            ...state.typewriter,
            displayed: state.typewriter.displayed.slice(0, -1),
          };
          break;
        case "START_DELETING":
          state.typewriter = { ...state.typewriter, deleting: true };
          break;
        case "NEXT_ROLE":
          state.typewriter = {
            roleIdx: (state.typewriter.roleIdx + 1) % roles.length,
            displayed: "",
            deleting: false,
          };
          break;
      }
    },
  },
});

export const { setIsAboutNameVisible, setTypewriter } = appCommon.actions;

export default appCommon.reducer;
