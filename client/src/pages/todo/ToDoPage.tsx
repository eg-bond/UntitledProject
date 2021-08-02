import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { TodoInput } from './TodoInput'
import { MapDispatchToPropsT, MapStateToPropsT } from './ToDoPageContainer'

export type DeleteTodoHandlerType = {
  deleteTodoHandler: (thisTodoId: string) => void
}

const ToDoPage: React.FC<
  MapStateToPropsT & MapDispatchToPropsT & DeleteTodoHandlerType
> = ({
  todoTitles,
  currentTodoId,
  todoContent,
  addTodo,
  addTodoContentItem,
  deleteTodoContentItem,
  selectTodo,
  selectContentItem,
  modifyTodoContent,
  deleteTodoHandler,
  ...props
}) => {
  // @ts-ignore
  let { todoId } = useParams()

  const [localTodoTitle, setLocalTodoTitle] = useState('')

  useEffect(() => {
    selectTodo(todoId)
  }, [todoId])

  useEffect(() => {
    if (currentTodoId) {
      setLocalTodoTitle(todoTitles[currentTodoId].value)
    }
  }, [currentTodoId])

  let titlesEntriesArr = Object.entries(todoTitles)

  let titleItem = {
    value: '',
    color: '',
    bold: false,
    italic: false,
    underline: false,
  }
  if (todoId) {
    titleItem = todoTitles[todoId]
  }

  let titleStyles = {
    fontWeight: titleItem.bold ? 700 : 400,
    textDecoration: titleItem.underline ? 'underline' : 'none',
    fontStyle: titleItem.italic ? 'italic' : 'normal',
    color: titleItem.color,
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
        <input
          style={{ ...titleStyles }}
          onBlur={() =>
            props.changeTodoTitle(todoId, { value: localTodoTitle })
          }
          onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
          onFocus={() => selectContentItem('title')}
          onChange={e => setLocalTodoTitle(e.target.value)}
          value={localTodoTitle}
          className='selectedTodo__H'
        />
        {todoId && (
          <div className='selectedTodo__items'>
            {todoContent[todoId].map(contentItem => (
              <div
                key={`${todoId}_${contentItem.order}`}
                className='selectedTodo__item'>
                <TodoInput
                  value={contentItem.value}
                  color={contentItem.color}
                  order={contentItem.order}
                  todoId={todoId}
                  modifyTodoContent={modifyTodoContent}
                  selectContentItem={selectContentItem}
                  itemProps={{ ...contentItem }}
                />
                <button
                  onClick={() =>
                    deleteTodoContentItem(todoId, contentItem.order)
                  }
                  className='selectedTodo__btn'>
                  del
                </button>
              </div>
            ))}
            <button onClick={() => addTodoContentItem(todoId)}>
              Add todo item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToDoPage
