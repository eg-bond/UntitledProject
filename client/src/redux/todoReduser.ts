// import { authAPI, AuthDataType, todoAPI } from '../api/api'
// import { ThunkAction } from 'redux-thunk'
import { InferActionsTypes } from './store'
// import { LoginFormDataType } from '../pages/login/AuthPage'
// import { authActions } from './authReduser'
import { DB_TodoDataT } from '../api/api'

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
        ...state.todoContent[state.currentTodoId!],
        {
          value: '',
          order: state.todoContent[state.currentTodoId!].length,
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
      let redusedTodo = [...state.todoContent[state.currentTodoId!]]
      redusedTodo.splice(action.order, 1)
      //упорядочиваем order
      redusedTodo.forEach((item, i) => {
        item.order = i
      })

      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [state.currentTodoId!]: redusedTodo,
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
    case 'todo/MODIFY_TODO_TITLE':
      return {
        ...state,
        todoTitles: {
          ...state.todoTitles,
          [state.currentTodoId!]: {
            ...state.todoTitles[state.currentTodoId!],
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
  modifyTodoTitle: (titleProps: Object) =>
    ({ type: 'todo/MODIFY_TODO_TITLE', titleProps } as const),
  modifyTodoContent: (itemProps: Partial<TodoItemPropsT>) =>
    ({
      type: 'todo/MODIFY_TODO_CONTENT',
      itemProps,
    } as const),
  setInitialTodoData: (todoData: DB_TodoDataT) =>
    ({ type: 'todo/SET_INITIAL_TODO_DATA', todoData } as const),
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
