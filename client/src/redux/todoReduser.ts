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
//         {title: 'lol', id: 'eg_bond_todo1'},
//         {title: 'lol2', id: 'eg_bond_todo2'}
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

let newState = {
  idGenerator: 4,
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
        bold: true,
        italic: false,
        underline: false,
      },
    ],
  },
  currentTodoId: 'eg_bond_todo1',
  selectedContentItem: 0,
}

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
        bold: true,
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
  currentTodoId: 'eg_bond_todo1',
  selectedContentItem: 0,
}
// let initialState: TodoInitialStateType = {
//   idGenerator: 0,
//   todoListArr: [],
//   todoContentObj: {},
//   selectedTodo: {
//     title: '',
//     content: [],
//   },
// }
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
    // case 'todo/SET_INITIAL_TODO_DATA':
    //   return {
    //     ...state,
    //     idGenerator: action.todoData.idGenerator,
    //     todoListArr: action.todoData.todoListArr,
    //     //@ts-ignore
    //     todoContentObj: action.todoData.todoContentObj,
    //   }
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
      return {
        ...state,
        currentTodoId: action.todoId,
      }
    // case 'todo/SELECT_TODO':
    //   if (action.todoId) {
    //     let titleObj = state.todoListArr.find(item => item.id === action.todoId)
    //     //@ts-ignore
    //     let content = state.todoContentObj[action.todoId]
    //     if (titleObj) {
    //       return {
    //         ...state,
    //         selectedTodo: { title: titleObj.title, content },
    //       }
    //     } else {
    //       return state
    //     }
    //   } else {
    //     return {
    //       ...state,
    //       selectedTodo: { title: '', content: [] },
    //     }
    //   }
    case 'todo/SELECT_CONTENT_ITEM':
      return {
        ...state,
        selectedContentItem: action.order,
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
      let targetItem = [...state.todoContent[action.todoId][state.order]]
      // @ts-ignore
      let modTodoItemContent = state.todoContent[action.todoId].map(item => {
        if (item.order === action.order) {
          return {
            ...item,
            value: action.value,
            color: action.color,
          }
        } else {
          return item
        }
      })
      return {
        ...state,
        todoContent: {
          ...state.todoContent,
          [action.todoId]: [...modTodoItemContent],
        },
        // todoContent[action.todoId][action.order]: []
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
  selectContentItem: (order: number) =>
    ({ type: 'todo/SELECT_CONTENT_ITEM', order } as const),
  changeTodoTitle: (todoId: string, title: string) =>
    ({ type: 'todo/CHANGE_TODO_TITLE', todoId, title } as const),
  modifyTodoContent: (
    todoId: string,
    order: number,
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
      order,
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
