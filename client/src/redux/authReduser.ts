import {authAPI, AuthDataType} from "../api/api";
import {ThunkAction} from "redux-thunk";
import {AppStateType, InferActionsTypes} from "./store";
import {LoginFormDataType} from "../pages/login/AuthPage";

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

type ActionsTypes = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const actions = {
    fetchInProgress: (inProgress: boolean) => ({type: "FETCH_IN_PROGRESS", inProgress}) as const,
    setAuthData: (authData: AuthDataType) => ({type: "SET_AUTH_DATA", loginData: authData}) as const,
    logout: () => ({type: "LOGOUT"}) as const
}

export const getAuthData = (token: string): ThunkType => {
    return async (dispatch) => {
        dispatch(actions.fetchInProgress(true))

        let responseData = await authAPI.me(token)

        if (responseData.statusCode === 0) {
            dispatch(actions.setAuthData(responseData.authData))
        } else {
            localStorage.removeItem('userData')
        }

        dispatch(actions.fetchInProgress(false))
    }
}

export const login = (formData: LoginFormDataType): ThunkType => {
    return async (dispatch) => {
        let responseData = await authAPI.login(formData)

        if (responseData.statusCode === 0) {
            localStorage.setItem('userData', JSON.stringify({token: responseData.token}));

            dispatch(actions.setAuthData(responseData.authData))
        } else {
            if (window.M && responseData.message) {
                window.M.toast({html: responseData.message}); //.toast это метод Материалайза, который выводит плашку с текстом на экран
            }
        }
    }
}

export default authReduser;