import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { reducer as formReducer } from 'redux-form'
import authReduser from './authReduser'
import editorReduser from './editorReduser'
import todoReduser from './todoReduser'

let rootReducer = combineReducers({
  form: formReducer,
  auth: authReduser,
  todo: todoReduser,
  editor: editorReduser,
})

const store = configureStore({ reducer: rootReducer })

type RootReducerType = typeof rootReducer // (globalstate: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType> // ReturnType вытаскивает возвращаемое из функции значение (тип этого значения)

// Pre-typed react-redux hooks
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppStateType> = useSelector

export default store
