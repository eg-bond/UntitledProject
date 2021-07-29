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

  console.log(props.order)

  const [insideValue, changeInsideValue] = useState(props.value)

  return (
    <input
      className={clrClass(props.color)}
      onChange={e => changeInsideValue(e.target.value)}
      value={insideValue}
      onKeyDown={(e: any) => e.key === 'Enter' && e.target.blur()}
      onFocus={() => props.selectContentItem(props.order)}
      onBlur={() =>
        props.modifyTodoContent(props.todoId, props.order, { insideValue })
      }
    />
  )
}
