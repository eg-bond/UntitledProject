import { DB_TodoDataT } from '../api/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// export type TodoItemPropsT = {
//   value: string
//   order: number
//   color?: string
//   bold?: boolean
//   italic?: boolean
//   underline?: boolean
// }
// export type TodoTitlePropsT = Omit<TodoItemPropsT, 'order'>

export type EditorInitialStateT = {
  chapterIdGen: number
  pagesIdGen: number
  currentChapter: string
  currentPage: string
  chapters: {
    [key: string]: {
      title: string
      pages: { [key: string]: { title: string } }
      // pages: Array<{ title: string; id: string }>
    }
  }
  pagesData: {
    [key: string]: { entityMap: {}; blocks: [] }
  }
  lastUpdate: number
}

let initialState: EditorInitialStateT = {
  chapterIdGen: 5,
  pagesIdGen: 5,
  currentChapter: '',
  currentPage: '',
  lastUpdate: 0,
  chapters: {
    chapter1: {
      title: 'chapter1',
      // pages: [
      //   { title: 'titlep1', id: 'ch1_page0' },
      //   { title: 'titlep2', id: 'ch1_page2' },
      //   { title: 'titlep3', id: 'ch1_page6' },
      // ],
      pages: {
        ch1_page0: { title: 'titlep1' },
        ch1_page2: { title: 'titlep2' },
        ch1_page6: { title: 'titlep3' },
      },
    },
    chapter2: {
      title: 'chapter2',
      pages: {
        ch2_page23: { title: 'asdf' },
        ch2_page11: { title: 'titlep2' },
      },
      // pages: [
      //   { title: 'asdf', id: 'ch2_page23' },
      //   { title: 'titlep2', id: 'ch2_page11' },
      // ],
    },
    chapter3: {
      title: 'chapter3',
      pages: {
        ch3_page13: { title: 'aaaaaaaaa' },
        ch3_page111: { title: 'titlep233' },
      },
      // pages: [
      //   { title: 'aaaaaaaaa', id: 'ch3_page13' },
      //   { title: 'titlep233', id: 'ch3_page111' },
      // ],
    },
  },
  pagesData: {
    ch1_page0: { entityMap: {}, blocks: [] },
    ch2_page11: { entityMap: {}, blocks: [] },
  },
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setInitialEditorData: (state, action: PayloadAction<DB_TodoDataT>) => {
      return { ...state, ...action.payload }
    },
    addChapter: state => {
      state.lastUpdate += 1
      state.chapterIdGen += 1
      let newChapterKey = 'ch' + state.chapterIdGen

      state.chapters[newChapterKey] = {
        title: 'chapter' + newChapterKey,
        pages: {},
      }
    },
    deleteChapter: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      let chapterKeys = Object.keys(state.chapters)
      if (chapterKeys.length === 0) {
        state.currentChapter = ''
        state.currentPage = ''
      } else {
        let chapterIndex = chapterKeys.findIndex(k => k == action.payload)
        if (chapterIndex === 0) {
          state.currentChapter = chapterKeys[chapterIndex + 1]
        } else {
          state.currentChapter = chapterKeys[chapterIndex - 1]
        }
        state.currentPage = ''
      }
      delete state.chapters[action.payload]
    },
    selectChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload
    },
    selectPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },
    modifyPageTitle: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      state.chapters[state.currentChapter].pages[state.currentPage].title =
        action.payload
    },

    // addTodoContentItem: state => {
    //   let newItem = {
    //     value: '',
    //     order: state.todoContent[state.currentTodoId!].length,
    //   }

    //   state.lastUpdate += 1
    //   state.todoContent[state.currentTodoId!].push(newItem)
    // },
    // deleteTodoContentItem: (state, action: PayloadAction<number>) => {
    //   let redusedTodo = [...state.todoContent[state.currentTodoId!]]
    //   redusedTodo.splice(action.payload, 1)
    //   //упорядочиваем order
    //   redusedTodo.forEach((item, i) => {
    //     item.order = i
    //   })

    //   state.lastUpdate += 1
    //   state.todoContent[state.currentTodoId!] = redusedTodo
    // },

    // selectContentItem: (
    //   state,
    //   action: PayloadAction<number | 'title' | null>
    // ) => {
    //   state.selectedContentItem = action.payload
    // },

    // modifyTodoContent: (state, action: PayloadAction<TodoItemPropsT>) => {
    //   let target = Number(state.selectedContentItem)
    //   state.lastUpdate += 1

    //   if (state.selectedContentItem !== null) {
    //     state.todoContent[state.currentTodoId!][target] = {
    //       ...state.todoContent[state.currentTodoId!][target],
    //       ...action.payload,
    //     }
    //   }
    // },
  },
})

export const editorActions = editorSlice.actions

export default editorSlice.reducer
