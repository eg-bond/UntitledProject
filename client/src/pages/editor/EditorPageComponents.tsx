import React from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { EditorChaptersT } from '../../redux/editorReduser'
import { AppDispatch } from '../../redux/store'
import {
  addChapter,
  deleteChapter,
  modifyPageTitle,
  selectChapter,
  selectPage,
  addPage,
  deletePage,
  modifyChapterTitle,
} from './EditorPage'
import s from './EditorPage.module.css'

export const EditorChapters: React.FC<{
  chapters: EditorChaptersT
  currentChapter: string
  d: AppDispatch
}> = ({ chapters, currentChapter, d }) => {
  const [chapterToRename, setRenamingChapter] = useState('')
  const [chapterTitle, setChapterTitle] = useState('Editing')

  const renameChapter = (chapterId: string, title: string) => {
    d(modifyChapterTitle({ chapterId, title }))
    setRenamingChapter('')
  }

  return (
    <div className={s.columns__chapters}>
      {Object.keys(chapters).map(ch => (
        <div key={ch}>
          {chapterToRename == ch ? (
            <input
              type='text'
              value={chapterTitle}
              autoFocus
              onChange={e => setChapterTitle(e.target.value)}
              onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
              onBlur={() => renameChapter(ch, chapterTitle)}
            />
          ) : (
            <>
              <Link
                style={{ color: ch == currentChapter ? 'red' : 'blue' }}
                onClick={() => d(selectChapter(ch))}
                to={`/editor/${ch}`}
                className=''>
                {chapters[ch].title}
              </Link>
              <button
                onClick={() => {
                  setChapterTitle(chapters[ch].title)
                  setRenamingChapter(ch)
                }}>
                ch
              </button>
              <button onClick={() => d(deleteChapter(ch))}>del</button>
            </>
          )}
        </div>
      ))}
      <button onClick={() => d(addChapter())}>add chapter</button>
    </div>
  )
}

export const ChapterPages: React.FC<{
  chapters: EditorChaptersT
  currentChapter: string
  currentPage: string
  d: AppDispatch
}> = ({ chapters, currentChapter, currentPage, d }) => {
  if (!currentChapter) {
    return null
  }

  const pagesObj = chapters[currentChapter].pages

  return (
    <div className={s.columns__chapters}>
      {Object.keys(pagesObj).map(pageId => (
        <div key={`${pageId}`}>
          <Link
            style={{ color: pageId == currentPage ? 'red' : 'blue' }}
            onClick={() => d(selectPage(pageId))}
            to={`/editor/${currentChapter}/${pageId}`}
            className=''>
            {pagesObj[pageId].title}
          </Link>
          <button onClick={() => d(deletePage(pageId))}>del</button>
        </div>
      ))}
      <button onClick={() => d(addPage())}>add page</button>
    </div>
  )
}

export const EditorTitle: React.FC<{
  currentPageTitle: string
  d: AppDispatch
}> = ({ currentPageTitle, d }) => {
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
