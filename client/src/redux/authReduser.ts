import {authAPI} from "../api/api";
import {FormAction} from "redux-form";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./store";


const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const GET_AUTH_DATA = 'GET_AUTH_DATA'
const SET_AUTH_DATA = 'SET_AUTH_DATA'
const FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS'

let initialState = {
    userId: null as string | null,
    email: null as string | null,
    name: null as string | null,
    lastname: null as string | null,
    nickname: null as string | null,
    isAuth: false,
    isFetching: false,
}

export type InitialStateType = typeof initialState;

export const authReduser = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case "SET_AUTH_DATA":
            return {
                ...state,
                ...action.loginData,
                isAuth: true
            }
        case "FETCH_IN_PROGRESS":
            return {
                ...state,
                isFetching: action.inProgress
            }
        case "LOGOUT":
            localStorage.removeItem('userData')
            return {
                ...state,
                userId: null,
                email: null,
                name: null,
                lastname: null,
                nickname: null,
                isAuth: false
            }

        default:
            return state;
    }
}

type ActionsTypes = SetAuthDataActionType | FetchInProgressType | LogoutActionType


export type FetchInProgressType = {type: typeof FETCH_IN_PROGRESS, inProgress: boolean}
export const fetchInProgress = (inProgress: boolean): FetchInProgressType => ({type: FETCH_IN_PROGRESS, inProgress})

//=========================
type SetAuthLoginDataActionType = {
    userId: string | null,
    email: string | null,
    name: string | null,
    lastname: string | null,
    nickname: string | null
}
export type SetAuthDataActionType = {type: typeof SET_AUTH_DATA, loginData: SetAuthLoginDataActionType}

export const setAuthData = (userId: string | null, name: string | null, lastname: string | null,
                            nickname: string | null, email: string | null): SetAuthDataActionType => {
    return {
        type: SET_AUTH_DATA,
        loginData: {userId, name, lastname, nickname, email}
    }
}
//============================

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getAuthData = (token: string): ThunkType => {
    return async (dispatch) => {
        dispatch(fetchInProgress(true))

        let authData = await authAPI.me(token)

        if (authData.userId) {
            dispatch(setAuthData(authData.userId, authData.name, authData.lastname, authData.nickname, authData.email))
        } else {
            localStorage.removeItem('userData')
        }

        dispatch(fetchInProgress(false))
    }
}

//formdata = {email: "someEmail", pass: "somePass"}
export const login = (formData: any): ThunkType => {
    return async (dispatch) => {
        let allAuthData = await authAPI.login(formData)

        if (allAuthData.token) {
            localStorage.setItem('userData', JSON.stringify({token: allAuthData.token}));

            dispatch(setAuthData(allAuthData.userId, allAuthData.name, allAuthData.lastname, allAuthData.nickname, allAuthData.email))
        } else {
            if (window.M && allAuthData.message) {
                window.M.toast({html: allAuthData.message}); //.toast это метод Материалайза, который выводит плашку с текстом на экран
            }
        }
    }
}

export type LogoutActionType = {type: typeof LOGOUT}
export const logout = (): LogoutActionType => ({type: LOGOUT})

export default authReduser;