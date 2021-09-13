import React, { useEffect, useState } from 'react'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const SomeComponent = () => {
  return <div>some component</div>
}

const content = localStorage['DraftEditor-state']
  ? JSON.parse(localStorage['DraftEditor-state'])
  : { entityMap: {}, blocks: [] }

export default function EditorPage() {
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

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName='demo-wrapper'
        editorClassName='demo-editor'
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
      <div className='gridPositioning'>
        <div className='toolbar'>toolbar</div>
        <div className='textarea'>textarea</div>
        <div className='firstColumn'>first column</div>
        <div className='secondColumn'>second column</div>
        <SomeComponent>
          <div>
            <p>hello</p>
          </div>
        </SomeComponent>
      </div>
    </div>
  )
}
