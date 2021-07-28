import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import {
  MapDispatchToPropsType,
  MapStateToPropsType,
} from './ToDoPageContainer'

export type DeleteTodoHandlerType = {
  deleteTodoHandler: (thisTodoId: string) => void
}

const ToDoPageNew: React.FC<
  MapStateToPropsType & MapDispatchToPropsType & DeleteTodoHandlerType
> = ({
  todoListArr,
  selectedTodo,
  addTodo,
  deleteTodo,
  addTodoContentItem,
  deleteTodoContentItem,
  selectTodo,
  modifyTodoContent,
  deleteTodoHandler,
  ...props
}) => {
  // @ts-ignore
  let { todoId } = useParams()

  const [localTodoTitle, setLocalTodoTitle] = useState('')

  // why is this working while TodoInput not?
  const CustomInput: React.FC<{
    value: string
    importance: string
    orderNum: number
  }> = props => {
    const importanceClass = (imp: string): string => {
      return imp === 'red'
        ? 'redImp'
        : imp === 'yellow'
        ? 'yellowImp'
        : imp === 'green'
        ? 'greenImp'
        : ''
    }

    const [insideValue, changeInsideValue] = useState(props.value)

    return (
      <input
        className={importanceClass(props.importance)}
        onChange={e => changeInsideValue(e.target.value)}
        value={insideValue}
        onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
        onBlur={() =>
          modifyTodoContent(
            todoId,
            insideValue,
            props.importance,
            props.orderNum
          )
        }
      />
    )
  }

  useEffect(() => {
    selectTodo(todoId)
    setLocalTodoTitle(selectedTodo.title)
  }, [todoId, selectedTodo.title])

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

  return (
    <div>
      <div className='todoPage'>
        <div className='leftBar'>
          {todoListArr.map(todo => (
            <div key={todo.id}>
              <NavLink to={`/todo/${todo.id}`} className='leftBar__item'>
                {todo.title}
              </NavLink>
              <button onClick={() => deleteTodoHandler(todo.id)}>del</button>
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
          <div className='selectedTodo__items'>
            {selectedTodo.content.map(contentItem => (
              <div
                key={`${todoId}_${contentItem.orderNum}`}
                className='selectedTodo__item'>
                <CustomInput
                  value={contentItem.value}
                  importance={contentItem.importance}
                  orderNum={contentItem.orderNum}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToDoPageNew
