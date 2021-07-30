import React, { useState } from 'react'

type InputType = {
  value: string
  color: string
  order: number
  modifyTodoContent: any
  todoId: string
  selectContentItem: any
}

export const TodoInput: React.FC<InputType> = props => {
  const clrClass = (clr: string): string => {
    return clr === 'red'
      ? 'redImp'
      : clr === 'yellow'
      ? 'yellowImp'
      : clr === 'green'
      ? 'greenImp'
      : ''
  }

  const [insideValue, changeInsideValue] = useState(props.value)
  const [focused, switchFocus] = useState(false)

  const focusHandler = (order, value) => {
    changeInsideValue(value)
    props.selectContentItem(order)
    switchFocus(true)
  }

  const blurHandler = () => {
    props.modifyTodoContent(props.todoId, props.order, {
      value: insideValue,
    })
    switchFocus(false)
  }

  return (
    <input
      className={clrClass(props.color)}
      onChange={e => changeInsideValue(e.target.value)}
      value={focused ? insideValue : props.value}
      onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
      onFocus={() => focusHandler(props.order, props.value)}
      onBlur={() => blurHandler()}
    />
  )
}
