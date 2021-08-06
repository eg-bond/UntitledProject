import { authAPI, AuthDataType, todoAPI } from '../api/api'
import { ThunkAction } from 'redux-thunk'
import { AppStateType, InferActionsTypes } from './store'
import { LoginFormDataType } from '../pages/login/AuthPage'
import { authActions } from './authReduser'

export type TodoItemPropsT = {
  value: string
  order: number
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}
export type TodoTitlePropsT = Omit<TodoItemPropsT, 'order'>

export type TodoInitialStateT = {
  idGenerator: number
  todoTitles: {
    [key: string]: TodoTitlePropsT
  }
  todoContent: {
    [key: string]: Array<TodoItemPropsT>
  }
  currentTodoId: string | null | undefined
  selectedContentItem: number | 'title' | null
}
// let initialState: TodoInitialStateT = {
//   idGenerator: 2,
//   todoTitles: {
//     eg_bond_todo1: {
//       value: 'title1',
//       color: 'black',
//       bold: true,
//       italic: false,
//       underline: false,
//     },
//   },
//   todoContent: {
//     eg_bond_todo1: [
//       {
//         order: 0,
//         value: 'bye bread',
//         color: 'green',
//         bold: false,
//         italic: false,
//         underline: false,
//       },
//       {
//         order: 1,
//         value: 'bye milk',
//         color: 'red',
//         bold: true,
//         italic: false,
//         underline: false,
//       },
//     ],
//   },
//   currentTodoId: null,
//   selectedContentItem: null,
// }
let initialState: TodoInitialStateT = {
  idGenerator: 0,
  todoTitles: {},
  todoContent: {},
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
        ...state.todoContent[String(state.currentTodoId)],
        {
          value: '',
          order: state.todoContent[String(state.currentTodoId)].length,
        },
      ]

      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [String(state.currentTodoId)]: newContent,
        },
      }
    case 'todo/DELETE_TODO_CONTENT_ITEM':
      let redusedTodo = [...state.todoContent[String(state.currentTodoId)]]
      redusedTodo.splice(action.order, 1)
      //упорядочиваем order
      redusedTodo.forEach((item, i) => {
        item.order = i
      })

      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [String(state.currentTodoId)]: redusedTodo,
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

    //Переименовать!!
    case 'todo/CHANGE_TODO_TITLE':
      return {
        ...state,
        todoTitles: {
          ...state.todoTitles,
          [String(state.currentTodoId)]: {
            ...state.todoTitles[String(state.currentTodoId)],
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
        newState.todoContent[String(state.currentTodoId)][
          Number(state.selectedContentItem)
        ] = {
          ...state.todoContent[String(state.currentTodoId)][
            Number(state.selectedContentItem)
          ],
          ...action.itemProps,
        }
      }

      return newState

    default:
      return state
  }
}

type InferredTodoActionsT = InferActionsTypes<typeof actions>

export const actions = {
  addTodo: () => ({ type: 'todo/ADD_TODO' } as const),
  deleteTodo: (todoId: string) =>
    ({ type: 'todo/DELETE_TODO', todoId } as const),
  addTodoContentItem: () =>
    ({
      type: 'todo/ADD_TODO_CONTENT_ITEM',
    } as const),
  deleteTodoContentItem: (order: number) =>
    ({ type: 'todo/DELETE_TODO_CONTENT_ITEM', order } as const),
  selectTodo: (todoId: string | null) =>
    ({ type: 'todo/SELECT_TODO', todoId } as const),
  selectContentItem: (order: number | 'title' | null) =>
    ({ type: 'todo/SELECT_CONTENT_ITEM', order } as const),
  changeTodoTitle: (titleProps: Object) =>
    ({ type: 'todo/CHANGE_TODO_TITLE', titleProps } as const),
  modifyTodoContent: (itemProps: Partial<TodoItemPropsT>) =>
    ({
      type: 'todo/MODIFY_TODO_CONTENT',
      itemProps,
    } as const),
  setInitialTodoData: (
    todoData: Omit<
      TodoInitialStateT,
      'currentTodoId' | 'selectedTodoContentItem'
    >
  ) => ({ type: 'todo/SET_INITIAL_TODO_DATA', todoData } as const),
}

// type ThunkType = ThunkAction<void, AppStateType, unknown, InferredTodoActionsT>

// export const getTodo = (): ThunkType => {
//   return async dispatch => {
//     dispatch(authActions.fetchInProgress(true)) // из authReduser
//     let responseData = await todoAPI.getTodo()
//     if (responseData.statusCode === 0) {
//       dispatch(actions.setInitialTodoData(responseData.todoData))
//     }

//     dispatch(authActions.fetchInProgress(false))
//   }
// }

export default todoReduser
