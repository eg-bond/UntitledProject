import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReduser from './authReduser'
import todoReduser from './todoReduser'

let rootReducer = combineReducers({
  auth: authReduser,
  todo: todoReduser,
})

const store = configureStore({ reducer: rootReducer })

type RootReducerType = typeof rootReducer // (globalstate: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType> // ReturnType вытаскивает возвращаемое из функции значение (тип этого значения)

export default store
