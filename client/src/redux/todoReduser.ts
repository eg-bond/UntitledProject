import {authAPI, AuthDataType} from "../api/api";
import {ThunkAction} from "redux-thunk";
import {AppStateType, InferActionsTypes} from "./store";
import {LoginFormDataType} from "../pages/login/AuthPage";

let initialState = {
    idGen: 3,
    noteTitles: [
        {noteTitle: 'someName1', id: 'note1'},
        {noteTitle: 'someName2', id: 'note2'}
    ],
    notes: {
        note1: [
            {value: 'bye bread', importance: 'green', itemId: 0},
            {value: 'bye milk', importance: 'yellow', itemId: 1},
            {value: 'bye salt', importance: 'red', itemId: 2}
        ],
        note2: [
            {value: 'learn JS', importance: 'red', itemId: 0},
            {value: 'do sports', importance: 'yellow', itemId: 1},
            {value: 'jerk off', importance: 'red', itemId: 2}
        ],
    }
}

export type TodoInitialStateType = typeof initialState

export const todoReduser = (state = initialState, action: ActionsTypes): TodoInitialStateType => {
    switch (action.type) {
        case "LOGOUT":
            return {
                ...state
            }


        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>
// type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const actions = {
    logout: () => ({type: "LOGOUT"}) as const
}



export default todoReduser;