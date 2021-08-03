import React, { useState } from 'react'
import { TodoActionsT, TodoItemPropsT } from '../../redux/todoReduser'

type ContentItemT = {
  todoId: string
  modifyTodoContent: TodoActionsT['modifyTodoContent']
  selectContentItem: TodoActionsT['selectContentItem']
  itemProps: TodoItemPropsT
}

export const TodoContentItem: React.FC<ContentItemT> = ({
  itemProps,
  selectContentItem,
  modifyTodoContent,
  todoId,
}) => {
  const { value, order, color, bold, italic, underline } = itemProps

  const [localValue, changeLocalValue] = useState(value)
  const [focused, switchFocus] = useState(false)

  const focusHandler = (order: number, value: string) => {
    changeLocalValue(value)
    selectContentItem(order)
    switchFocus(true)
  }

  const blurHandler = () => {
    modifyTodoContent(todoId, {
      value: localValue,
    })
    switchFocus(false)
  }

  let styles = {
    fontWeight: bold ? 700 : 400,
    textDecoration: underline ? 'underline' : 'none',
    fontStyle: italic ? 'italic' : 'normal',
    color,
  }

  return (
    <input
      style={{ ...styles }}
      onChange={e => changeLocalValue(e.target.value)}
      value={focused ? localValue : value}
      onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
      onFocus={() => focusHandler(order, value)}
      onBlur={() => blurHandler()}
    />
  )
}
