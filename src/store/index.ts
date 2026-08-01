// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import common from "./apps/common";

export const store = configureStore({
  reducer: {
    common,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
