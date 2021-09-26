import React, { useEffect, useState } from 'react'
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
import { debug } from 'console'

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
  let [content, setContent] = useState({ entityMap: {}, blocks: [] })
  let [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(content))
  )

  useEffect(() => {
    if (!currentPage) {
      setContent({ entityMap: {}, blocks: [] })
    } else if (currentPageData) {
      setContent(currentPageData)
      setEditorState(
        EditorState.createWithContent(convertFromRaw(currentPageData))
      )
    } else {
      let cont = JSON.parse(localStorage[currentPage])
      setContent(cont)
      setEditorState(EditorState.createWithContent(convertFromRaw(cont)))
    }
  }, [currentPage])

  console.log(content)

  // debounse
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage[currentPage] = JSON.stringify(
        convertToRaw(editorState.getCurrentContent())
      )
      d(modifyPageData(convertToRaw(editorState.getCurrentContent())))
    }, 1000)

    return () => clearTimeout(timeout)
  }, [editorState])
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
