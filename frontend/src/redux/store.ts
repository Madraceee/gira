import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import modalSlice from "./modal/modalSlice";


const store = configureStore({
    reducer: {
        user : userSlice,
        modal: modalSlice
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export default store;