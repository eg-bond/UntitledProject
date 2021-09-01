import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { TodoContentItem } from './TodoContentItem'
import { TodoReduxPropsT } from './ToDoPageContainer'

interface ToDoPagePropsT
  extends Omit<
    TodoReduxPropsT,
    'idGenerator' | 'setInitialTodoData' | 'lastUpdate'
  > {
  todoId: string
  deleteTodoHandler: (thisTodoId: string) => void
}

const ToDoPage: React.FC<ToDoPagePropsT> = ({
  todoId,
  todoTitles,
  currentTodoId,
  todoContent,
  selectedContentItem,
  addTodo,
  addTodoContentItem,
  deleteTodoContentItem,
  selectTodo,
  selectContentItem,
  modifyTodoContent,
  deleteTodoHandler,
  ...props
}) => {
  const [localTodoTitle, setLocalTodoTitle] = useState('')

  useEffect(() => {
    if (currentTodoId) {
      let { value } = { ...todoTitles[currentTodoId] }
      setLocalTodoTitle(value)
    }
  }, [currentTodoId])

  let titlesEntriesArr = Object.entries(todoTitles)
  let { bold, underline, italic, color } = { ...todoTitles[todoId] }

  let titleStyles = {
    fontWeight: bold ? 700 : 400,
    textDecoration: underline ? 'underline' : 'none',
    fontStyle: italic ? 'italic' : 'normal',
    color: color,
    borderBottom:
      selectedContentItem === 'title' ? '1px solid red' : '1px solid #9e9e9e',
  }

  return (
    <div className='todoPage'>
      <div className='leftBar'>
        {titlesEntriesArr.map(entry => (
          <div key={`${entry[0]}_title`}>
            <NavLink
              onClick={() => selectContentItem(null)}
              to={`/todo/${entry[0]}`}
              className='leftBar__item'>
              {entry[1].value}
            </NavLink>
            <button onClick={() => deleteTodoHandler(entry[0])}>del</button>
          </div>
        ))}

        <button onClick={addTodo} className='leftBar__btn'>
          Add note
        </button>
      </div>

      <div className='selectedTodo'>
        {todoId && (
          <input
            style={{ ...titleStyles }}
            onBlur={() => props.modifyTodoTitle({ value: localTodoTitle })}
            onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
            onFocus={() => selectContentItem('title')}
            onChange={e => setLocalTodoTitle(e.target.value)}
            value={localTodoTitle}
            className='selectedTodo__H'
          />
        )}
        {todoId && (
          <div className='selectedTodo__items'>
            {todoContent[todoId].map((contentItem, i) => (
              <div
                key={`${todoId}_${contentItem.order}`}
                className='selectedTodo__item'>
                <TodoContentItem
                  modifyTodoContent={modifyTodoContent}
                  active={selectedContentItem === i ? true : false}
                  selectContentItem={selectContentItem}
                  itemProps={{ ...contentItem }}
                />
                <button
                  onClick={() => deleteTodoContentItem(contentItem.order)}
                  className='selectedTodo__btn'>
                  del
                </button>
              </div>
            ))}
            <button onClick={() => addTodoContentItem()}>Add todo item</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToDoPage
