import {
  authAPI,
  AuthDataType,
  todoAPI,
  TodoAPIInitialStateType,
} from '../api/api'
import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from './store'
import { LoginFormDataType } from '../pages/login/AuthPage'
import { authActions } from './authReduser'

export type TodoTitlePropsT = {
  value: string
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}
export type TodoItemPropsT = TodoTitlePropsT & { order: number }

export type TodoInitialStateT = {
  idGenerator: number
  todoTitles: {
    [key: string]: TodoTitlePropsT
  }
  todoContent: {
    [key: string]: Array<TodoItemPropsT>
  }
  currentTodoId: string | null
  selectedContentItem: number | 'title' | null
}
let initialState: TodoInitialStateT = {
  idGenerator: 2,
  todoTitles: {
    eg_bond_todo1: {
      value: 'title1',
      color: 'black',
      bold: true,
      italic: false,
      underline: false,
    },
  },
  todoContent: {
    eg_bond_todo1: [
      {
        order: 0,
        value: 'bye bread',
        color: 'green',
        bold: false,
        italic: false,
        underline: false,
      },
      {
        order: 1,
        value: 'bye milk',
        color: 'red',
        bold: true,
        italic: false,
        underline: false,
      },
    ],
  },
  currentTodoId: null,
  selectedContentItem: null,
}

export const todoReduser = (
  state = initialState,
  action: InferredTodoActionsT
): TodoInitialStateT => {
  switch (action.type) {
    case 'todo/SET_INITIAL_TODO_DATA':
      return {
        ...state,
        idGenerator: action.todoData.idGenerator,
        todoTitles: action.todoData.todoTitles,
        todoContent: action.todoData.todoContent,
      }
    case 'todo/ADD_TODO':
      return {
        ...state,
        idGenerator: ++state.idGenerator,
        todoTitles: {
          ...state.todoTitles,
          [`eg_bond_todo${state.idGenerator}`]: {
            value: `eb_${state.idGenerator}_title`,
          },
        },
        todoContent: {
          ...state.todoContent,
          [`eg_bond_todo${state.idGenerator}`]: [],
        },
      }
    case 'todo/DELETE_TODO':
      let newS = {
        ...state,
        todoTitles: {
          ...state.todoTitles,
        },
        todoContent: {
          ...state.todoContent,
        },
      }

      delete newS.todoTitles[action.todoId]
      delete newS.todoContent[action.todoId]
      return newS

    case 'todo/ADD_TODO_CONTENT_ITEM':
      let newContent = [
        ...state.todoContent[action.todoId],
        {
          value: '',
          order: state.todoContent[action.todoId].length,
        },
      ]

      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [action.todoId]: newContent,
        },
      }
    case 'todo/DELETE_TODO_CONTENT_ITEM':
      let redusedTodo = [...state.todoContent[action.todoId]]
      redusedTodo.splice(action.order, 1)

      //упорядочиваем order
      redusedTodo.forEach((item, i) => {
        item.order = i
      })

      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [action.todoId]: redusedTodo,
        },
      }
    case 'todo/SELECT_TODO':
      return {
        ...state,
        currentTodoId: action.todoId,
      }
    case 'todo/SELECT_CONTENT_ITEM':
      return {
        ...state,
        selectedContentItem: action.order,
      }
    case 'todo/CHANGE_TODO_TITLE':
      return {
        ...state,
        todoTitles: {
          ...state.todoTitles,
          [action.todoId]: {
            ...state.todoTitles[action.todoId],
            ...action.titleProps,
          },
        },
      }
    case 'todo/MODIFY_TODO_CONTENT':
      let newState = {
        ...state,
        todoContent: {
          ...state.todoContent,
        },
      }
      if (state.selectedContentItem !== null) {
        //@ts-ignore
        newState.todoContent[action.todoId][state.selectedContentItem] = {
          //@ts-ignore
          ...state.todoContent[action.todoId][state.selectedContentItem],
          ...action.itemProps,
        }
      }

      return newState

    default:
      return state
  }
}
export type TodoActionsT = typeof actions
type InferredTodoActionsT = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, InferredTodoActionsT>

export type ItemPropsToDispatch = {
  value?: string
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}
export const actions = {
  addTodo: () => ({ type: 'todo/ADD_TODO' } as const),
  deleteTodo: (todoId: string) =>
    ({ type: 'todo/DELETE_TODO', todoId } as const),
  addTodoContentItem: (todoId: string) =>
    ({
      type: 'todo/ADD_TODO_CONTENT_ITEM',
      todoId,
    } as const),
  deleteTodoContentItem: (todoId: string, order: number) =>
    ({ type: 'todo/DELETE_TODO_CONTENT_ITEM', todoId, order } as const),
  selectTodo: (todoId: string) =>
    ({ type: 'todo/SELECT_TODO', todoId } as const),
  selectContentItem: (order: number | 'title' | null) =>
    ({ type: 'todo/SELECT_CONTENT_ITEM', order } as const),
  changeTodoTitle: (todoId: string, titleProps: Object) =>
    ({ type: 'todo/CHANGE_TODO_TITLE', todoId, titleProps } as const),
  modifyTodoContent: (todoId: string, itemProps: ItemPropsToDispatch) =>
    ({
      type: 'todo/MODIFY_TODO_CONTENT',
      todoId,
      itemProps,
    } as const),
  setInitialTodoData: (todoData: TodoAPIInitialStateType) =>
    ({ type: 'todo/SET_INITIAL_TODO_DATA', todoData } as const),
}

export const getTodo = (): ThunkType => {
  return async dispatch => {
    //@ts-ignore
    // dispatch(authActions.fetchInProgress(true)) // из authReduser

    let responseData = await todoAPI.getTodo()

    if (responseData.statusCode === 0) {
      dispatch(actions.setInitialTodoData(responseData.todoData))
    }
    //@ts-ignore
    // dispatch(authActions.fetchInProgress(false))
  }
}

export default todoReduser
