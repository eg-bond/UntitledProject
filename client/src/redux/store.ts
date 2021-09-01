import { configureStore } from '@reduxjs/toolkit'
import { combineReducers, compose, applyMiddleware, createStore } from 'redux'
import { reducer as formReducer } from 'redux-form'
import thunkMiddleware from 'redux-thunk'
import authReduser, { AuthInitialStateType } from './authReduser'
import todoReduser, { TodoInitialStateT } from './todoReduser'
import { todoReduserNew } from './todoReduserNew'

let rootReducer = combineReducers({
  form: formReducer,
  auth: authReduser,
  todo: todoReduser,
})

type RootReducerType = typeof rootReducer // (globalstate: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType> // ReturnType вытаскивает возвращаемое из функции значение (тип этого значения)

// typization for actions
type PropertiesTypes<T> = T extends { [key: string]: infer U } ? U : never

export type InferActionsTypes<
  T extends { [key: string]: (...args: any[]) => any }
> = ReturnType<PropertiesTypes<T>>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const store = configureStore({
//   reducer: {
//     form: formReducer,
//     auth: authReduser,
//     todo: todoReduser,
//   },
// })

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

// @ts-ignore
window.__store__ = store

export default store
