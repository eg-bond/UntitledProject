import React, { useCallback, useEffect, useRef, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import s from './EditorPage.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { NavLink } from 'react-router-dom'
import { editorActions, EditorChaptersT } from '../../redux/editorReduser'
import {
  ChapterPages,
  EditorChapters,
  EditorTitle,
} from './EditorPageComponents'
import useUpdateEffect from '../../hooks/useUpdateEffect'
import usePrevious from '../../hooks/usePrevious'

// action creators
export const {
  addChapter,
  selectChapter,
  selectPage,
  modifyPageTitle,
  deleteChapter,
  addPage,
  deletePage,
  modifyChapterTitle,
  modifyPageData,
} = editorActions

// 1. Insert pagesData from Redux based on currentPage
// - If there is no such page in Redux - receive from server

function EditorPage() {
  const d = useAppDispatch()
  // selectors
  const chapters = useAppSelector(state => state.editor.chapters)
  const currentChapter = useAppSelector(state => state.editor.currentChapter)
  const currentPage = useAppSelector(state => state.editor.currentPage)
  const currentPageTitle = useAppSelector(state => {
    return chapters[currentChapter]?.pages[currentPage]?.title || ''
  })
  const currentPageData = useAppSelector(state => {
    return state.editor.pagesData[currentPage]
  })

  // Выбираем первую главу при монтировании компоненты
  useEffect(() => {
    d(selectChapter(Object.keys(chapters)[0]))
  }, [])

  //----------------------------------------------------------
  let [editorState, setEditorState] = useState(EditorState.createEmpty())
  let [stateForDB, setStateDB] = useState({})
  const prevCurrentPage = usePrevious(currentPage)

  // let [stateContent, setStateContent] = useState(
  //   convertToRaw(editorState.getCurrentContent())
  // )

  // inserting pagesData from server or Redux state
  useUpdateEffect(() => {
    // console.log('current page effect')

    if (currentPageData) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(currentPageData))
      )
    } else {
      // !!!UPD 1 - заменить экшеном getCurrentPageData
      let cont = JSON.parse(localStorage[currentPage])
      setEditorState(EditorState.createWithContent(convertFromRaw(cont)))
    }
  }, [currentPage])

  // update redux pagesData state and send data to server (with debounce 1000)
  useUpdateEffect(() => {
    let stateData = convertToRaw(editorState.getCurrentContent())

    if (JSON.stringify(stateData) !== JSON.stringify(currentPageData)) {
      d(modifyPageData(stateData))
    }
  }, [editorState])

  useEffect(() => {
    const timeout = setTimeout(() => {
      let stateData = convertToRaw(editorState.getCurrentContent())
      // console.log('DB')
      localStorage[currentPage] = JSON.stringify(stateData)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [currentPageData])

  useUpdateEffect(() => {
    console.log('curr: ' + currentPage)
    console.log('prev: ' + prevCurrentPage)
    setStateDB(convertToRaw(editorState.getCurrentContent()))
    console.log(convertToRaw(editorState.getCurrentContent()))
    const timeout = setTimeout(() => {
      console.log('DB')
      localStorage[currentPage + '_test'] = JSON.stringify(stateForDB)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [currentPageData])
  //----------------------------------------------------------

  return (
    <div className={s.container}>
      <div className={s.columns}>
        <EditorChapters
          chapters={chapters}
          currentChapter={currentChapter}
          d={d}
        />
        <ChapterPages
          chapters={chapters}
          currentChapter={currentChapter}
          currentPage={currentPage}
          d={d}
        />
      </div>
      <EditorTitle currentPageTitle={currentPageTitle} d={d} />
      <Editor
        editorState={editorState}
        wrapperClassName={s.editor}
        toolbarClassName={s.editor__toolbar}
        editorClassName={s.editor__textarea}
        onEditorStateChange={setEditorState}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
            'colorPicker',
            'image',
            'remove',
            'history',
          ],
        }}
      />
    </div>
  )
}

export default React.memo(EditorPage)
