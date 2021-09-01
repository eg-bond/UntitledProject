import { authAPI, DB_AuthDataT } from '../api/api'
import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from './store'
import { LoginFormDataType } from '../pages/login/AuthPage'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'redux'

let initialState = {
  email: null as string | null,
  name: null as string | null,
  lastname: null as string | null,
  nickname: null as string | null,
  isAuth: false,
  isFetching: false,
}

export type AuthInitialStateType = typeof initialState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<DB_AuthDataT>) => {
      return { ...state, ...action.payload, isAuth: true }
    },
    fetchInProgress: (state, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload
    },
    logout: state => {
      return {
        ...state,
        email: null,
        name: null,
        lastname: null,
        nickname: null,
        isAuth: false,
      }
    },
  },
})

export const { setAuthData, fetchInProgress, logout } = authSlice.actions

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, Action>

export const getAuthData = (token: string): ThunkType => {
  return async dispatch => {
    dispatch(fetchInProgress(true))

    let responseData = await authAPI.me(token)
    if (responseData.statusCode === 0) {
      dispatch(setAuthData(responseData.authData))
    } else {
      localStorage.removeItem('userData')
    }

    dispatch(fetchInProgress(false))
  }
}

export const login = (formData: LoginFormDataType): ThunkType => {
  return async dispatch => {
    let responseData = await authAPI.login(formData)

    if (responseData.statusCode === 0) {
      localStorage.userData = JSON.stringify({ token: responseData.token })
      dispatch(setAuthData(responseData.authData))
    } else {
      if (window.M && responseData.message) {
        //.toast это метод Материалайза, который выводит плашку с текстом на экран
        window.M.toast({ html: responseData.message })
      }
    }
  }
}

export default authSlice.reducer
