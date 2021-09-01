import { DB_TodoDataT } from '../api/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
  lastUpdate: number
}

let initialState: TodoInitialStateT = {
  idGenerator: 0,
  todoTitles: {},
  todoContent: {},
  currentTodoId: null,
  selectedContentItem: null,
  lastUpdate: 0,
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setInitialTodoData: (state, action: PayloadAction<DB_TodoDataT>) => {
      return { ...state, ...action.payload }
    },
    addTodo: state => {
      state.lastUpdate += 1
      state.idGenerator += 1
      let newTodoKey = `eg_bond_todo${state.idGenerator}`

      state.todoTitles[newTodoKey] = { value: 'Без заголовка' }
      state.todoContent[newTodoKey] = []
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      delete state.todoTitles[action.payload]
      delete state.todoContent[action.payload]
    },
    addTodoContentItem: state => {
      let newItem = {
        value: '',
        order: state.todoContent[state.currentTodoId!].length,
      }

      state.lastUpdate += 1
      state.todoContent[state.currentTodoId!].push(newItem)
    },
    deleteTodoContentItem: (state, action: PayloadAction<number>) => {
      let redusedTodo = [...state.todoContent[state.currentTodoId!]]
      redusedTodo.splice(action.payload, 1)
      //упорядочиваем order
      redusedTodo.forEach((item, i) => {
        item.order = i
      })

      state.lastUpdate += 1
      state.todoContent[state.currentTodoId!] = redusedTodo
    },
    selectTodo: (state, action: PayloadAction<string | null>) => {
      state.currentTodoId = action.payload
    },
    selectContentItem: (
      state,
      action: PayloadAction<number | 'title' | null>
    ) => {
      state.selectedContentItem = action.payload
    },
    modifyTodoTitle: (state, action: PayloadAction<object>) => {
      state.lastUpdate += 1
      state.todoTitles[state.currentTodoId!] = {
        ...state.todoTitles[state.currentTodoId!],
        ...action.payload,
      }
    },
    modifyTodoContent: (state, action: PayloadAction<TodoItemPropsT>) => {
      let target = Number(state.selectedContentItem)
      state.lastUpdate += 1

      if (state.selectedContentItem !== null) {
        state.todoContent[state.currentTodoId!][target] = {
          ...state.todoContent[state.currentTodoId!][target],
          ...action.payload,
        }
      }
    },
  },
})

export const todoActions = todoSlice.actions

// type InferredTodoActionsT = InferActionsTypes<typeof todoActions>

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

export default todoSlice.reducer
