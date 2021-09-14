import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import s from './EditorPage.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { NavLink } from 'react-router-dom'
import { editorActions } from '../../redux/editorReduser'

// action creators
const { selectChapter, selectPage, modifyPageTitle, deleteChapter } =
  editorActions

const content = localStorage['DraftEditor-state']
  ? JSON.parse(localStorage['DraftEditor-state'])
  : { entityMap: {}, blocks: [] }

const EditorTitle: React.FC<{ currentPageTitle: string; d: Function }> = ({
  currentPageTitle,
  d,
}) => {
  const [title, setLocalTitle] = useState(currentPageTitle)

  useEffect(() => {
    setLocalTitle(currentPageTitle)
  }, [currentPageTitle])

  return (
    <div className={s.title}>
      {currentPageTitle && (
        <input
          // style={{ ...titleStyles }}
          onBlur={() => d(modifyPageTitle(title))}
          onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
          // onFocus={() => selectContentItem('title')}
          onChange={e => setLocalTitle(e.target.value)}
          value={title}
          // className='selectedTodo__H'
        />
      )}
    </div>
  )
}

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

  const EditorChapters = () => {
    return (
      <div className={s.columns__chapters}>
        {Object.keys(chapters).map(ch => (
          <div key={ch}>
            <NavLink
              onClick={() => d(selectChapter(ch))}
              to={`/editor/${ch}`}
              className=''>
              {chapters[ch].title}
            </NavLink>
            <button>ch</button>
            <button onClick={() => d(deleteChapter(ch))}>del</button>
          </div>
        ))}
      </div>
    )
  }
  const ChapterPages = () => {
    if (!currentChapter) {
      return null
    }
    const pagesObj = chapters[currentChapter].pages
    return (
      <div className={s.columns__chapters}>
        {Object.keys(pagesObj).map(pageId => (
          <NavLink
            key={`${pageId}`}
            onClick={() => d(selectPage(pageId))}
            to={`/editor/${currentChapter}/${pageId}`}
            className=''>
            {pagesObj[pageId].title}
          </NavLink>
        ))}
      </div>
    )
  }

  return (
    <div className={s.container}>
      <div className={s.columns}>
        <EditorChapters />
        <ChapterPages />
      </div>
      <EditorTitle currentPageTitle={currentPageTitle} d={d} />
      {/* <div className={s.title}>title</div> */}
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
