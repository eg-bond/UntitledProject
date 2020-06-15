import {authAPI, AuthDataType} from "../api/api";
import {ThunkAction} from "redux-thunk";
import {AppStateType, InferActionsTypes} from "./store";
import {LoginFormDataType} from "../pages/login/AuthPage";

let initialState = {
    idGen: 2,
    todoTitles: [
        {todoTitle: 'someName1', id: 'todo1'},
        {todoTitle: 'someName2', id: 'todo2'}
    ],
    todos: {
        todo1: [
            {value: 'bye bread', importance: 'green', itemId: 0},
            {value: 'bye milk', importance: 'yellow', itemId: 1},
            {value: 'bye salt', importance: 'red', itemId: 2}
        ],
        todo2: [
            {value: 'learn JS', importance: 'red', itemId: 0},
            {value: 'do sports', importance: 'yellow', itemId: 1},
            {value: 'jerk off', importance: 'red', itemId: 2}
        ],
    },
    selectedTodo: {
        title: 'someName1',
        content: [
            {value: 'bye bread', importance: 'green', itemId: 0},
            {value: 'bye milk', importance: 'yellow', itemId: 1},
            {value: 'bye salt', importance: 'red', itemId: 2}]
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
            state.idGen++;
            return {
                ...state,
                todoTitles: [...state.todoTitles, {todoTitle: "todo without name", id: `todo${state.idGen}`}],
                todos: {...state.todos, [`todo${state.idGen}`]: []}
            }
        case 'DELETE_TODO':
            let newTodoTitles = state.todoTitles.filter(item => item.id !== action.noteId)

            let newTodos = {...state.todos}
            // @ts-ignore
            for (let key in newTodos) {key === action.noteId && delete newTodos[key]}
            return {
                ...state,
                todoTitles: [...newTodoTitles],
                todos: {...newTodos}
            }
        case 'ADD_TODO_ITEM':
            let newContent = [...state.selectedTodo.content, {value: action.value, importance: action.importance, itemId: state.selectedTodo.content.length}]

            return {
                ...state,
                todos: {...state.todos, [action.noteId]: newContent},
                selectedTodo: {...state.selectedTodo, content: newContent}
            }
        case 'DELETE_TODO_ITEM':
            let content = [...state.selectedTodo.content]
            content.splice(action.itemId, 1)

            for (let i = 0; i <= content.length-1; i++) { //упорядочиваем itemId
                content[i].itemId = i
            }
            return {
                ...state,
                todos: {...state.todos, [action.noteId]: content},
                selectedTodo: {...state.selectedTodo, content: content}
            }
        case 'SELECT_TODO':
            if (action.noteId) {
                let titleObj = state.todoTitles.find(item => item.id === action.noteId)
                // @ts-ignore
                let content = state.todos[action.noteId]
                if (titleObj) {
                    return {
                        ...state,
                        selectedTodo: {title: titleObj.todoTitle, content}
                    }
                } else {return state}
            } else {
                return {
                    ...state,
                    selectedTodo: {title: '', content: []}
                }
            }
        case 'CHANGE_TODO_TITLE':
            let modifiedTodoTitles = state.todoTitles.map(item => {
                if (item.id === action.noteId) {
                    return {...item, todoTitle: action.title}
                } else {
                    return item
                }
            })
            return {
                ...state,
                todoTitles: [...modifiedTodoTitles],
                selectedTodo: {...state.selectedTodo, title: action.title}
            }
        case 'CHANGE_TODO_ITEM_CONTENT':
            //@ts-ignore
            let modTodoItemContent = state.todos[action.noteId].map(item => {
                if (item.itemId === action.itemId) {
                    return {...item, value: action.value}
                } else {
                    return item
                }
            })
            return {
                ...state,
                todos: {...state.todos, [action.noteId]: [...modTodoItemContent]},
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
    deleteTodo: (noteId: string) => ({type: 'DELETE_TODO', noteId}) as const,
    addTodoItem: (noteId: string, value: string, importance: string) => ({type: 'ADD_TODO_ITEM', noteId, value, importance}) as const,
    deleteTodoItem: (noteId: string, itemId: number) => ({type: 'DELETE_TODO_ITEM', noteId, itemId}) as const,
    selectTodo: (noteId: string) => ({type: 'SELECT_TODO', noteId}) as const,
    changeTodoTitle: (noteId: string, title: string) => ({type: 'CHANGE_TODO_TITLE', noteId, title}) as const,
    changeTodoItemContent: (noteId: string, value: string, itemId: number) => ({type: 'CHANGE_TODO_ITEM_CONTENT', noteId, value, itemId}) as const
}






export default todoReduser;