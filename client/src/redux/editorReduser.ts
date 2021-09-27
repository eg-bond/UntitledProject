import { DB_TodoDataT } from '../api/api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RawDraftContentBlock, RawDraftContentState } from 'draft-js'

// export type TodoItemPropsT = {
//   value: string
//   order: number
//   color?: string
//   bold?: boolean
//   italic?: boolean
//   underline?: boolean
// }
export type EditorChaptersT = {
  [key: string]: {
    title: string
    pages: { [key: string]: { title: string } }
    // pages: Array<{ title: string; id: string }>
  }
}

export type EditorInitialStateT = {
  chapterIdGen: number
  pagesIdGen: number
  currentChapter: string
  currentPage: string
  chapters: EditorChaptersT
  pagesData: {
    [key: string]: RawDraftContentState
  }
  lastUpdate: number
}

let initialState: EditorInitialStateT = {
  chapterIdGen: 3,
  pagesIdGen: 50,
  currentChapter: '',
  currentPage: '',
  lastUpdate: 0,
  chapters: {
    chapter1: {
      title: 'chapter1',
      pages: {
        chapter1_page0: { title: 'titlep1' },
        chapter1_page2: { title: 'titlep2' },
      },
    },
  },
  pagesData: {
    // chapter1_page0: { entityMap: {}, blocks: [] },
    // chapter2_page2: { entityMap: {}, blocks: [] },
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
      state.pagesIdGen += 1

      let newChapterKey = 'chapter' + state.chapterIdGen
      state.currentChapter = newChapterKey
      state.currentPage = newChapterKey + '_page' + state.pagesIdGen

      state.chapters[newChapterKey] = {
        title: 'chapter' + newChapterKey,
        pages: { [state.currentPage]: { title: 'without title' } },
      }
    },
    deleteChapter: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      let chapterKeys = Object.keys(state.chapters)
      if (chapterKeys.length === 1) {
        state.currentChapter = ''
        state.currentPage = ''
      } else {
        let chapterIndex = chapterKeys.findIndex(k => k == action.payload)
        if (chapterIndex === 0) {
          state.currentChapter = chapterKeys[chapterIndex + 1]
        } else {
          state.currentChapter = chapterKeys[chapterIndex - 1]
        }
        state.currentPage = Object.keys(
          state.chapters[state.currentChapter].pages
        )[0]
      }
      delete state.chapters[action.payload]
    },
    modifyChapterTitle: (
      state,
      action: PayloadAction<{ chapterId: string; title: string }>
    ) => {
      state.lastUpdate += 1
      state.chapters[action.payload.chapterId].title = action.payload.title
    },
    selectChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload
      state.currentPage = Object.keys(
        state.chapters[state.currentChapter].pages
      )[0]
    },
    addPage: state => {
      state.lastUpdate += 1
      state.pagesIdGen += 1

      let newPageKey = state.currentChapter + '_page' + state.pagesIdGen
      state.currentPage = newPageKey

      state.chapters[state.currentChapter].pages[newPageKey] = {
        title: 'without title',
      }
      localStorage[newPageKey] = JSON.stringify({ entityMap: {}, blocks: [] })
    },
    deletePage: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      let pagesKeys = Object.keys(state.chapters[state.currentChapter].pages)
      if (pagesKeys.length === 1) {
        state.currentPage = ''
      } else {
        let pageIndex = pagesKeys.findIndex(k => k == action.payload)
        if (pageIndex === 0) {
          state.currentPage = pagesKeys[pageIndex + 1]
        } else {
          state.currentPage = pagesKeys[pageIndex - 1]
        }
      }
      delete state.chapters[state.currentChapter].pages[action.payload]
    },
    selectPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },
    modifyPageTitle: (state, action: PayloadAction<string>) => {
      state.lastUpdate += 1
      state.chapters[state.currentChapter].pages[state.currentPage].title =
        action.payload
    },
    modifyPageData: (state, action: PayloadAction<RawDraftContentState>) => {
      state.lastUpdate += 1
      state.pagesData[state.currentPage] = action.payload
    },
  },
})

export const editorActions = editorSlice.actions

export default editorSlice.reducer
