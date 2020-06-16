import {authAPI, AuthDataType} from "../api/api";
import {ThunkAction} from "redux-thunk";
import {AppStateType, InferActionsTypes} from "./store";
import {LoginFormDataType} from "../pages/login/AuthPage";

let initialState = {
    idGenerator: 2,
    todoListObj: [
        {title: 'someName1', id: 'eg_bond_todo1'},
        {title: 'someName2', id: 'eg_bond_todo2'}
    ],
    todoContentObj: {
        eg_bond_todo1: [
            {value: 'bye bread', importance: 'green', orderNum: 0},
            {value: 'bye milk', importance: 'yellow', orderNum: 1},
            {value: 'bye salt', importance: 'red', orderNum: 2}
        ],
        eg_bond_todo2: [
            {value: 'learn JS', importance: 'red', orderNum: 0},
            {value: 'do sports', importance: 'yellow', orderNum: 1},
            {value: 'jerk off', importance: 'red', orderNum: 2}
        ],
    },
    selectedTodo: {
        title: 'someName1',
        content: [
            {value: 'bye bread', importance: 'green', orderNum: 0},
            {value: 'bye milk', importance: 'yellow', orderNum: 1},
            {value: 'bye salt', importance: 'red', orderNum: 2}]
    }
}

export type TodoInitialStateType = typeof initialState
export type ContentItemType = {
    value: string,
    importance: string,
    itemId: number
}

export const todoReduser = (state = initialState, action: ActionsTypes): TodoInitialStateType => {

    switch (action.type) {
        case 'ADD_TODO':
            state.idGenerator++;
            return {
                ...state,
                todoListObj: [...state.todoListObj, {title: "todo without name", id: `todo${state.idGenerator}`}],
                todoContentObj: {...state.todoContentObj, [`todo${state.idGenerator}`]: []}
            }
        case 'DELETE_TODO':
            let redusedTodoListObj = state.todoListObj.filter(item => item.id !== action.todoId)

            let redusedTodoContentObj = {...state.todoContentObj}
            // @ts-ignore
            for (let key in redusedTodoContentObj) {key === action.todoId && delete redusedTodoContentObj[key]}
            return {
                ...state,
                todoListObj: [...redusedTodoListObj],
                todoContentObj: {...redusedTodoContentObj}
            }
        case 'ADD_TODO_CONTENT_ITEM':
            let newContent = [...state.selectedTodo.content, {value: action.value, importance: action.importance, orderNum: state.selectedTodo.content.length}]

            return {
                ...state,
                todoContentObj: {...state.todoContentObj, [action.todoId]: newContent},
                selectedTodo: {...state.selectedTodo, content: newContent}
            }
        case 'DELETE_TODO_CONTENT_ITEM':
            let redusedContent = [...state.selectedTodo.content]
            redusedContent.splice(action.orderNum, 1)

            for (let i = 0; i <= redusedContent.length-1; i++) { //упорядочиваем itemId
                redusedContent[i].orderNum = i
            }
            return {
                ...state,
                todoContentObj: {...state.todoContentObj, [action.todoId]: redusedContent},
                selectedTodo: {...state.selectedTodo, content: redusedContent}
            }
        case 'SELECT_TODO':
            if (action.todoId) {
                let titleObj = state.todoListObj.find(item => item.id === action.todoId)
                // @ts-ignore
                let content = state.todoContentObj[action.todoId]
                if (titleObj) {
                    return {
                        ...state,
                        selectedTodo: {title: titleObj.title, content}
                    }
                } else {return state}
            } else {
                return {
                    ...state,
                    selectedTodo: {title: '', content: []}
                }
            }
        case 'CHANGE_TODO_TITLE':
            let modifiedTodoTitles = state.todoListObj.map(item => {
                if (item.id === action.todoId) {
                    return {...item, todoTitle: action.title}
                } else {
                    return item
                }
            })
            return {
                ...state,
                todoListObj: [...modifiedTodoTitles],
                selectedTodo: {...state.selectedTodo, title: action.title}
            }
        case 'MODIFY_TODO_CONTENT':
            // @ts-ignore
            let modTodoItemContent = state.todoContentObj[action.todoId].map(item => {
                if (item.orderNum === action.orderNum) {
                    return {...item, value: action.value}
                } else {
                    return item
                }
            })
            return {
                ...state,
                todoContentObj: {...state.todoContentObj, [action.todoId]: [...modTodoItemContent]},
                selectedTodo: {...state.selectedTodo, content: [...modTodoItemContent]}
            }
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>
// type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const actions = {
    addTodo: () => ({type: 'ADD_TODO'}) as const,
    deleteTodo: (todoId: string) => ({type: 'DELETE_TODO', todoId}) as const,
    addTodoContentItem: (todoId: string, value: string, importance: string) => ({type: 'ADD_TODO_CONTENT_ITEM', todoId, value, importance}) as const,
    deleteTodoContentItem: (todoId: string, orderNum: number) => ({type: 'DELETE_TODO_CONTENT_ITEM', todoId, orderNum }) as const,
    selectTodo: (todoId: string) => ({type: 'SELECT_TODO', todoId}) as const,
    changeTodoTitle: (todoId: string, title: string) => ({type: 'CHANGE_TODO_TITLE', todoId, title}) as const,
    modifyTodoContent: (todoId: string, value: string, orderNum: number) => ({type: 'MODIFY_TODO_CONTENT', todoId, value, orderNum }) as const
}







export default todoReduser;