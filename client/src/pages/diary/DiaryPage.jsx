import React from 'react'

let styles = {
  padding: '20px',
  boxShadow: '0 0 5px 0 black',
  outline: 'none',
  minHeight: '300px',
  markgin: '30px 0',
}

const boldHandler = e => {
  document.execCommand('bold')
}

let parObj = [
  {
    elem: 'p',
    paragraphContent: [
      { value: 'some string ', bold: false, underline: false },
      { value: 'boldPart ', bold: true, underline: false },
      { value: 'underlinePart ', bold: false, underline: true },
      { value: 'normalStr ', bold: false, underline: false },
    ],
  },
  {
    elem: 'p',
    paragraphContent: [
      {
        value: 'absolutely another string ',
        bold: false,
        underline: false,
      },
      {
        value: 'for checking selection ',
        bold: true,
        underline: false,
      },
      { value: 'and somth ', bold: false, underline: true },
      { value: 'asdfsdaf', bold: false, underline: false },
    ],
  },
]

const DiaryPage = () => {
  return (
    <div>
      <h1>Editor</h1>
      {/* <div className='controls'>
        <button onClick={boldHandler} className='boldBnt'>
          B
        </button>
        <button className='underlineBnt'>U</button>
        <button className='italicBnt'>I</button>
        <button type='text' className='clrBtn'>
          clr
        </button>
      </div>

      <div
        id='content'
        style={{ ...styles }}
        contentEditable
        spellCheck={false}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas,
        sapiente non perspiciatis ullam iure fugiat repellendus doloremque
        aliquid officia nihil architecto veniam, dicta nesciunt. Iure alias
        accusamus sapiente quae illum.
      </div> */}

      <span
        id={'our_span'}
        contentEditable
        className='myspan'
        // onSelect={e => console.log(e.target.selectionStart)}
      >
        just paragrapg
      </span>

      <div contentEditable spellCheck={false} className='main'>
        <p>
          <span>some txt</span>
          <span> some other txt</span>
          <span> and other</span>
        </p>
        <p>
          <span>absolutely different </span>
          <span> and much more complicated</span>
          <span> bautiful text</span>
        </p>
      </div>

      <div>Params Object</div>
      <div contentEditable>
        {parObj.map((item, i) => (
          <p>
            {item.paragraphContent.map(span => (
              <span>{span.value}</span>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}

export default DiaryPage
