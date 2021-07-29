import React, { useState } from 'react'

type InputType = {
  value: string
  importance: string
  orderNum: number
  modifyTodoContent: any
  todoId: string
}

export const TodoInput: React.FC<InputType> = props => {
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
        props.modifyTodoContent(
          props.todoId,
          insideValue,
          props.importance,
          props.orderNum
        )
      }
    />
  )
}
