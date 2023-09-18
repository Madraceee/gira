import { createSlice } from "@reduxjs/toolkit"

export type UserState = {
    token : string,
    email : string,
    name : string,
    role : string,
    isLoggedIn: boolean,
}

export type ActionState = {
    payload : UserState,
    type: string,
}


const initialState : UserState = {
    token: "",
    email: "",
    name: "",
    role: "",
    isLoggedIn: false,
}

const Login = (state : UserState, action : ActionState) =>{
    state.email = action.payload.email;
    state.name = action.payload.name;
    state.token = action.payload.token;
    state.role = action.payload.role;
    state.isLoggedIn = true;
}

const Logout = (state : UserState) =>{
    state.email = ""
    state.name = ""
    state.token = ""
    state.role = ""
    state.isLoggedIn = false;
}

const SetEpic = (state: UserState,action: ActionState)=>{
    state.email = state.email;
    state.name = state.name;
    state.token = state.token;
    state.role = state.role;
    state.isLoggedIn = true;
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers :{
        login : (state,action)=>Login(state,action),
        logout : (state)=>Logout(state),
    }
})


export default userSlice.reducer;
export const { login , logout } = userSlice.actions;