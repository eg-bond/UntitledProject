import {combineReducers, compose, applyMiddleware, createStore} from "redux";
import {reducer as formReducer} from 'redux-form';
import authReduser from "./authReduser";
import thunkMiddleware from "redux-thunk";

let reducer = combineReducers({
    form: formReducer,
    auth: authReduser
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware)))

// const store = createStore(reducer)

window.__store__ = store

export default store
