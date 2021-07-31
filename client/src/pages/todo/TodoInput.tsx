import React, { useState } from 'react'

type InputType = {
  value: string
  color: string
  order: number
  modifyTodoContent: any
  todoId: string
  selectContentItem: any
}

export const TodoInput: React.FC<InputType> = ({
  itemProps,
  selectContentItem,
  modifyTodoContent,
  todoId,
}) => {
  const { value, order, color, bold, italic, underline, selectionClr } =
    itemProps

  // const clrClass = (clr: string): string => {
  //   return clr === 'red'
  //     ? 'redImp'
  //     : clr === 'yellow'
  //     ? 'yellowImp'
  //     : clr === 'green'
  //     ? 'greenImp'
  //     : ''
  // }

  const [insideValue, changeInsideValue] = useState(value)
  const [focused, switchFocus] = useState(false)

  const focusHandler = (order, value) => {
    changeInsideValue(value)
    selectContentItem(order)
    switchFocus(true)
  }

  const blurHandler = () => {
    modifyTodoContent(todoId, {
      value: insideValue,
    })
    switchFocus(false)
  }

  let styles = {
    fontWeight: bold ? 'bold' : 'normal',
    textDecoration: underline ? 'underline' : 'none',
    fontStyle: italic ? 'italic' : 'normal',
    color,
    backgroundColor: selectionClr,
  }

  return (
    <input
      style={{ ...styles }}
      // className={clrClass(color)}
      onChange={e => changeInsideValue(e.target.value)}
      value={focused ? insideValue : value}
      onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
      onFocus={() => focusHandler(order, value)}
      onBlur={() => blurHandler()}
    />
  )
}
