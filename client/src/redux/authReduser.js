import {authAPI} from "../api/api";

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const GET_AUTH_DATA = 'GET_AUTH_DATA'
const SET_AUTH_DATA = 'SET_AUTH_DATA'
const FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS'

let initialState = {
    userId: null,
    email: null,
    name: null,
    lastname: null,
    nickname: null,
    token: null,
    isAuth: false,
    isFetching: false
}

export const authReduser = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_DATA:
            return {
                ...state,
                ...action.loginData,
                isAuth: true
            }
        case FETCH_IN_PROGRESS:
            return {
                ...state,
                isFetching: action.inProgress
            }
        case LOGOUT:
            localStorage.removeItem('userData')
            return {
                ...state,
                userId: null,
                email: null,
                name: null,
                lastname: null,
                nickname: null,
                token: null,
                isAuth: false
            }

        default:
            return state;
    }
}

export const fetchInProgress = (inProgress) => ({type: FETCH_IN_PROGRESS, inProgress})
export const setAuthData = (token, userId, name, lastname, nickname, email) => {
    return {
        type: SET_AUTH_DATA,
        loginData: {token, userId, name, lastname, nickname, email}
    }
}
export const getAuthData = (token) => {
    return async (dispatch) => {
        let authData = await authAPI.me(token)
        dispatch(fetchInProgress(true))
        dispatch(setAuthData(authData.token, authData.userId, authData.name, authData.lastname, authData.nickname, authData.email))
        dispatch(fetchInProgress(false))
    }
}

export const login = (formData) => {
    return async (dispatch) => {
        let allAuthData = await authAPI.login(formData)

        localStorage.setItem('userData', JSON.stringify({
            token: allAuthData.token
        }));

        dispatch(setAuthData(allAuthData.token, allAuthData.userId, allAuthData.name, allAuthData.lastname, allAuthData.nickname, allAuthData.email))
    }
}

export const logout = () => ({type: LOGOUT})

export default authReduser;