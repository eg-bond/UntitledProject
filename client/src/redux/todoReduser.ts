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

// let initialState = {
//     idGenerator: 4,
//     todoListArr: [
//         {title: 'lol', id: 'eg_asddo1'},
//         {title: 'lol2', id: 'eg_basdo2'}
//     ],
//     todoContentObj: {
//         eg_bond_todo1: [
//             {value: 'bye bread', importance: 'green', orderNum: 0},
//             {value: 'bye milk', importance: 'yellow', orderNum: 1},
//             {value: 'bye salt', importance: 'red', orderNum: 2}
//         ],
//         eg_bond_todo2: [
//             {value: 'learn JS', importance: 'red', orderNum: 0},
//             {value: 'do sports', importance: 'yellow', orderNum: 1},
//             {value: 'jerk off', importance: 'red', orderNum: 2}
//         ],
//     },
//     selectedTodo: {
//         title: 'someName1',
//         content: [
//             {value: 'bye bread', importance: 'green', orderNum: 0},
//             {value: 'bye milk', importance: 'yellow', orderNum: 1},
//             {value: 'bye salt', importance: 'red', orderNum: 2}]
//     }
// }

// export type FormattingType = {
//   fontSize: string
//   bold: boolean
//   italic: boolean
//   underline: boolean
//   selectionColor: string
// }

type TodoContentObjType = {
  [key: string]: Array<{
    value: string
    importance: string
    orderNum: number
  }>
}
export type TodoInitialStateType = {
  idGenerator: number
  todoListArr: Array<{ title: string; id: string }>
  todoContentObj: TodoContentObjType
  selectedTodo: {
    title: string
    content: Array<{ value: string; importance: string; orderNum: number }>
  }
}
let initialState: TodoInitialStateType = {
  idGenerator: 0,
  todoListArr: [],
  todoContentObj: {},
  selectedTodo: {
    title: '',
    content: [],
  },
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
        todoListArr: action.todoData.todoListArr,
        //@ts-ignore
        todoContentObj: action.todoData.todoContentObj,
      }
    case 'todo/ADD_TODO':
      return {
        ...state,
        idGenerator: ++state.idGenerator,
        todoListArr: [
          ...state.todoListArr,
          {
            title: 'todo without name',
            id: `eg_bond_todo${state.idGenerator}`,
          },
        ],
        todoContentObj: {
          ...state.todoContentObj,
          [`eg_bond_todo${state.idGenerator}`]: [],
        },
      }
    case 'todo/DELETE_TODO':
      let redusedtodoListArr = state.todoListArr.filter(
        item => item.id !== action.todoId
      )

      let redusedTodoContentObj = { ...state.todoContentObj }
      //@ts-ignore
      for (let key in redusedTodoContentObj) {
        key === action.todoId && delete redusedTodoContentObj[key]
      }
      return {
        ...state,
        todoListArr: redusedtodoListArr,
        todoContentObj: redusedTodoContentObj,
      }
    case 'todo/ADD_TODO_CONTENT_ITEM':
      let newContent = [
        ...state.selectedTodo.content,
        {
          value: action.value,
          importance: action.importance,
          orderNum: state.selectedTodo.content.length,
        },
      ]

      return {
        ...state,
        todoContentObj: {
          ...state.todoContentObj,
          [action.todoId]: newContent,
        },
        selectedTodo: { ...state.selectedTodo, content: newContent },
      }
    case 'todo/DELETE_TODO_CONTENT_ITEM':
      let redusedContent = [...state.selectedTodo.content]
      redusedContent.splice(action.orderNum, 1)

      for (let i = 0; i <= redusedContent.length - 1; i++) {
        //упорядочиваем itemId
        redusedContent[i].orderNum = i
      }
      return {
        ...state,
        todoContentObj: {
          ...state.todoContentObj,
          [action.todoId]: redusedContent,
        },
        selectedTodo: { ...state.selectedTodo, content: redusedContent },
      }
    case 'todo/SELECT_TODO':
      if (action.todoId) {
        let titleObj = state.todoListArr.find(item => item.id === action.todoId)
        //@ts-ignore
        let content = state.todoContentObj[action.todoId]
        if (titleObj) {
          return {
            ...state,
            selectedTodo: { title: titleObj.title, content },
          }
        } else {
          return state
        }
      } else {
        return {
          ...state,
          selectedTodo: { title: '', content: [] },
        }
      }
    case 'todo/CHANGE_TODO_TITLE':
      let modifiedTodoTitles = state.todoListArr.map(item => {
        if (item.id === action.todoId) {
          return { ...item, title: action.title }
        } else {
          return item
        }
      })
      return {
        ...state,
        todoListArr: [...modifiedTodoTitles],
        selectedTodo: { ...state.selectedTodo, title: action.title },
      }
    case 'todo/MODIFY_TODO_CONTENT':
      // @ts-ignore
      let modTodoItemContent = state.todoContentObj[action.todoId].map(item => {
        if (item.orderNum === action.orderNum) {
          return {
            ...item,
            value: action.value,
            importance: action.importance,
          }
        } else {
          return item
        }
      })
      return {
        ...state,
        todoContentObj: {
          ...state.todoContentObj,
          [action.todoId]: [...modTodoItemContent],
        },
        selectedTodo: {
          ...state.selectedTodo,
          content: [...modTodoItemContent],
        },
      }
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
  addTodoContentItem: (todoId: string, value: string, importance: string) =>
    ({
      type: 'todo/ADD_TODO_CONTENT_ITEM',
      todoId,
      value,
      importance,
    } as const),
  deleteTodoContentItem: (todoId: string, orderNum: number) =>
    ({ type: 'todo/DELETE_TODO_CONTENT_ITEM', todoId, orderNum } as const),
  selectTodo: (todoId: string) =>
    ({ type: 'todo/SELECT_TODO', todoId } as const),
  changeTodoTitle: (todoId: string, title: string) =>
    ({ type: 'todo/CHANGE_TODO_TITLE', todoId, title } as const),
  modifyTodoContent: (
    todoId: string,
    value: string,
    importance: string,
    orderNum: number
  ) =>
    ({
      type: 'todo/MODIFY_TODO_CONTENT',
      todoId,
      value,
      importance,
      orderNum,
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
