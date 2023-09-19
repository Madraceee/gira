import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ReactElement } from "react"

export type ModalState = {
    isOpen: boolean
    children: ReactElement | null,
    header: string,
}

export type ActionState = {
    payload : ModalState,
    type: string,
}

const initialState : ModalState = {
    isOpen: false,
    children : null,
    header : ""
}

const OpenModal = (state : ModalState, action : ActionState) =>{
    state.children = action.payload.children;
    state.header = action.payload.header;
    state.isOpen = true;
}

const CloseModal = (state : ModalState) =>{
    state.children = null;
    state.header = "";
    state.isOpen = false;
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state,action)=>OpenModal(state,action),
        closeModal: (state)=>CloseModal(state)
    }
})

export default modalSlice.reducer;
export const { openModal , closeModal} = modalSlice.actions