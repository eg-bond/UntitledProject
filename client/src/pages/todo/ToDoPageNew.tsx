import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { TodoInput } from './TodoInput'
import {
  MapDispatchToPropsType,
  MapStateToPropsType,
} from './ToDoPageContainer'

export type DeleteTodoHandlerType = {
  deleteTodoHandler: (thisTodoId: string) => void
}

const ContentDiv = props => {
  console.log('r')
  // const [insideValue, changeInsideValue] = useState(props.value)
  return <div>{props.value}</div>
}

const ToDoPageNew: React.FC<
  MapStateToPropsType & MapDispatchToPropsType & DeleteTodoHandlerType
> = ({
  // todoListArr,
  todoTitles,
  selectedTodo,
  currentTodoId,
  todoContent,
  addTodo,
  // deleteTodo,
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
  console.log(selectedTodo)

  const [localTodoTitle, setLocalTodoTitle] = useState('')

  useEffect(() => {
    selectTodo(todoId)
    if (currentTodoId) {
      setLocalTodoTitle(todoTitles[currentTodoId])
    }
  }, [todoId, currentTodoId])

  const importanceBtn = (contentItem: any, color: string) => {
    return (
      <button
        onClick={() =>
          modifyTodoContent(
            todoId,
            contentItem.value,
            color,
            contentItem.orderNum
          )
        }
        className='selectedTodo__btn'>
        {color}
      </button>
    )
  }

  let titlesEntriesArr = Object.entries(todoTitles)

  return (
    <div className='todoPage'>
      <div className='leftBar'>
        {titlesEntriesArr.map(entry => (
          <div key={`${entry[0]}_title`}>
            <NavLink to={`/todo/${entry[0]}`} className='leftBar__item'>
              {entry[1]}
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
          onBlur={() => props.changeTodoTitle(todoId, localTodoTitle)}
          onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
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
            {todoContent[todoId].map(contentItem => (
              <div key={`${todoId}_${contentItem.order}_111`}>
                <ContentDiv value={contentItem.value} />
              </div>
            ))}
            <button onClick={() => addTodoContentItem(todoId)}>
              Add todo item
            </button>
          </div>
        )}

        {/* <div className='selectedTodo__items'>
          {selectedTodo.content.map(contentItem => (
            <div
              key={`${todoId}_${contentItem.orderNum}`}
              className='selectedTodo__item'>
              <TodoInput
                value={contentItem.value}
                importance={contentItem.importance}
                orderNum={contentItem.orderNum}
                todoId={todoId}
                modifyTodoContent={modifyTodoContent}
              />
              {importanceBtn(contentItem, 'red')}
              {importanceBtn(contentItem, 'yellow')}
              {importanceBtn(contentItem, 'green')}
              {importanceBtn(contentItem, 'noth')}
              <button
                onClick={() =>
                  deleteTodoContentItem(todoId, contentItem.orderNum)
                }
                className='selectedTodo__btn'>
                del
              </button>
            </div>
          ))}
          <button onClick={() => addTodoContentItem(todoId, '', 'noth')}>
            Add todo item
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default ToDoPageNew
