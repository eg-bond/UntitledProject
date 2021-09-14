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
} = editorActions

const content = localStorage['DraftEditor-state']
  ? JSON.parse(localStorage['DraftEditor-state'])
  : { entityMap: {}, blocks: [] }

function EditorPage() {
  let [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromRaw(content))
  )

  // debounse
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage['DraftEditor-state'] = JSON.stringify(
        convertToRaw(editorState.getCurrentContent())
      )
    }, 1000)

    return () => clearTimeout(timeout)
  }, [editorState])

  const d = useAppDispatch()
  // selectors
  const chapters = useAppSelector(state => state.editor.chapters)
  const currentChapter = useAppSelector(state => state.editor.currentChapter)
  const currentPage = useAppSelector(state => state.editor.currentPage)
  const currentPageTitle = useAppSelector(state => {
    return chapters[currentChapter]?.pages[currentPage]?.title || ''
  })

  // console.log(currentPageTitle)

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
