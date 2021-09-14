import React, { useState } from 'react'
import { TodoItemPropsT } from '../../redux/todoReduser'
import { TodoReduxPropsT } from './ToDoPageContainer'

type ContentItemPropsT = {
  modifyTodoContent: TodoReduxPropsT['modifyTodoContent']
  selectContentItem: TodoReduxPropsT['selectContentItem']
  itemProps: TodoItemPropsT
  active: boolean
}

export const TodoContentItem: React.FC<ContentItemPropsT> = ({
  selectContentItem,
  modifyTodoContent,
  itemProps,
  active,
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
    modifyTodoContent({ value: localValue, order })
    switchFocus(false)
  }

  let styles = {
    fontWeight: bold ? 700 : 400,
    textDecoration: underline ? 'underline' : 'none',
    fontStyle: italic ? 'italic' : 'normal',
    color,
    borderBottom: active ? '1px solid red' : '1px solid #9e9e9e',
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
