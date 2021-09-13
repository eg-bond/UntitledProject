import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import authReduser from './authReduser'
import todoReduser from './todoReduser'

let rootReducer = combineReducers({
  form: formReducer,
  auth: authReduser,
  todo: todoReduser,
})

const store = configureStore({ reducer: rootReducer })

type RootReducerType = typeof rootReducer // (globalstate: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType> // ReturnType вытаскивает возвращаемое из функции значение (тип этого значения)

export default store
