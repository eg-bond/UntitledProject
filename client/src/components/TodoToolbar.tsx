import React from 'react'
import { TodoReduxPropsT } from '../pages/todo/ToDoPageContainer'
import { TodoItemPropsT } from '../redux/todoReduser'

type ContentItemPropsT = Pick<
  TodoReduxPropsT,
  | 'todoTitles'
  | 'modifyTodoContent'
  | 'todoContent'
  | 'selectedContentItem'
  | 'modifyTodoTitle'
> & { todoId: string }

const TodoToolbar: React.FC<ContentItemPropsT> = ({
  todoId,
  todoTitles,
  todoContent,
  selectedContentItem,
  modifyTodoContent,
  modifyTodoTitle,
}) => {
  if (!todoId) {
    return null
  }

  let contentItem
  if (selectedContentItem === 'title') {
    contentItem = todoTitles[todoId]
  } else if (selectedContentItem !== null) {
    contentItem = todoContent[todoId][selectedContentItem]
  }

  let {
    color = 'black',
    bold = false,
    italic = false,
    underline = false,
  } = { ...contentItem }

  const modify = (propsToModify: Partial<TodoItemPropsT>) => {
    if (selectedContentItem === 'title') {
      modifyTodoTitle({ ...propsToModify })
    } else {
      modifyTodoContent({ ...propsToModify })
    }
  }
  return (
    <div>
      <button
        style={{ backgroundColor: bold ? 'red' : 'transparent' }}
        onClick={() => modify({ bold: !bold })}>
        Ж
      </button>
      <button
        style={{ backgroundColor: italic ? 'red' : 'transparent' }}
        onClick={() => modify({ italic: !italic })}>
        К
      </button>
      <button
        style={{ backgroundColor: underline ? 'red' : 'transparent' }}
        onClick={() => modify({ underline: !underline })}>
        Ч
      </button>
      <button
        style={{ backgroundColor: color === 'red' ? 'red' : 'transparent' }}
        onClick={() => modify({ color: 'red' })}>
        Красный
      </button>
      <button
        style={{ backgroundColor: color === 'yellow' ? 'red' : 'transparent' }}
        onClick={() => modify({ color: 'yellow' })}>
        Желтый
      </button>
      <button
        style={{ backgroundColor: color === 'green' ? 'red' : 'transparent' }}
        onClick={() => modify({ color: 'green' })}>
        Зеленый
      </button>
      <button
        style={{ backgroundColor: color === 'black' ? 'red' : 'transparent' }}
        onClick={() => modify({ color: 'black' })}>
        Без цвета
      </button>

      <button
        onClick={() =>
          modify({
            color: 'black',
            bold: false,
            italic: false,
            underline: false,
          })
        }>
        Очистить
      </button>
    </div>
  )
}

export default TodoToolbar
