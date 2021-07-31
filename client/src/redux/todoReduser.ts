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

export type FormattingType = {
  fontSize: string
  bold: boolean
  italic: boolean
  underline: boolean
  selectionColor: string
}

type TodoContentT = {
  [key: string]: Array<{
    order: number
    value: string
    color: string
    selectionClr: string
    bold: boolean
    italic: boolean
    underline: boolean
  }>
}
export type TodoInitialStateType = {
  idGenerator: number
  todoTitles: { [key: string]: string }
  todoContent: TodoContentT
  currentTodoId: string | null
  selectedContentItem: number | null
}
let initialState: TodoInitialStateType = {
  idGenerator: 2,
  todoTitles: {
    eg_bond_todo1: 'title1',
  },
  todoContent: {
    eg_bond_todo1: [
      {
        order: 0,
        value: 'bye bread',
        color: 'green',
        selectionClr: 'blue',
        bold: false,
        italic: false,
        underline: false,
      },
      {
        order: 1,
        value: 'bye milk',
        color: 'red',
        selectionClr: 'blue',
        bold: true,
        italic: false,
        underline: false,
      },
    ],
  },
  currentTodoId: null,
  selectedContentItem: 0,
}

// export type TodoInitialStateType = typeof initialState

export const todoReduser = (
  state = initialState,
  action: ActionsTypes
): TodoInitialStateType => {
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
          [`eg_bond_todo${state.idGenerator}`]: `eb_${state.idGenerator}_title`,
        },
        todoContent: {
          ...state.todoContent,
          [`eg_bond_todo${state.idGenerator}`]: [],
        },
      }
    case 'todo/DELETE_TODO':
      let newS = { ...state }
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

      for (let i = 0; i <= redusedTodo.length - 1; i++) {
        //упорядочиваем order
        redusedTodo[i].order = i
      }
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
        todoTitles: { ...state.todoTitles, [action.todoId]: action.title },
      }
    case 'todo/MODIFY_TODO_CONTENT':
      let newState = {
        ...state,
        todoContent: {
          ...state.todoContent,
        },
      }
      newState.todoContent[action.todoId][state.selectedContentItem] = {
        ...state.todoContent[action.todoId][state.selectedContentItem],
        ...action.itemProps,
      }

      return newState
    //ToolbarActions-------------------------
    // case 'todo/CHANGE_COLOR'

    default:
      return state
  }
}

type ActionsTypes = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<void, AppStateType, unknown, ActionsTypes>

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
  selectContentItem: (order: number) =>
    ({ type: 'todo/SELECT_CONTENT_ITEM', order } as const),
  changeTodoTitle: (todoId: string, title: string) =>
    ({ type: 'todo/CHANGE_TODO_TITLE', todoId, title } as const),
  modifyTodoContent: (
    todoId: string,
    // order: number,
    itemProps: {
      value?: string
      color?: string
      selectionClr?: string
      bold?: boolean
      italic?: boolean
      underline?: boolean
    }
  ) =>
    ({
      type: 'todo/MODIFY_TODO_CONTENT',
      todoId,
      // order,
      itemProps,
    } as const),
  setInitialTodoData: (todoData: TodoAPIInitialStateType) =>
    ({ type: 'todo/SET_INITIAL_TODO_DATA', todoData } as const),
  clearFormatting: (todoId: string) =>
    ({ type: 'todo/CLEAR_FORMATTING', todoId } as const),
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
