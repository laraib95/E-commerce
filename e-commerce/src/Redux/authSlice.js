import { createSlice } from "@reduxjs/toolkit";
const getInitialAuthState = () => {
    const token = localStorage.getItem('userToken');
    const userProfile = localStorage.getItem('userProfile');
    if (token && userProfile)
        try {
            const parsedUserProfile = JSON.parse(userProfile);
            return {
                isLoggedIn: true,
                user: parsedUserProfile,
                token: token
            }
        } catch (error) {
            console.error('Failed to Parse  User Profile ', error)
            localStorage.removeItem('userToken');
            localStorage.removeItem('userProfile');
            return {
                isLoggedIn: false,
                user: 'null',
                token: 'null'
            };
        }
    return {
        isLoggedIn: false,
        user: null,
        token: null
    };
}
const authSlice = createSlice({
    name: 'auth',      //name of slice used in action types
    initialState: getInitialAuthState(),
    reducers: {
        //reducer for successful login
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token

            localStorage.setItem('userToken', action.payload.token);
            localStorage.setItem('userProfile', JSON.stringify(action.payload.user));
        },
        //reducer for logout
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            //clean from localstorage
            localStorage.removeItem('userToken');
            localStorage.removeItem('userProfile');
        },
        //reducer for updating the User Profile 
        updateSuccess: (state, action) => {
            state.user = action.payload;        //Backend sends back the updated user Object
            localStorage.setItem('userData', JSON.stringify(action.payload));
        },
    },
});
//exports all actions
export const { loginSuccess, logout, updateSuccess } = authSlice.actions;
export default authSlice.reducer;   //export reducers as default