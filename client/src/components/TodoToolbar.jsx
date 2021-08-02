import React from 'react'

const TodoToolbar = ({
  todoId,
  todoTitles,
  modifyTodoContent,
  todoContent,
  selectedContentItem,
  changeTodoTitle,
}) => {
  let contentItem
  if (selectedContentItem === 'title') {
    contentItem = todoTitles[todoId]
  } else if (selectedContentItem !== null) {
    contentItem = todoContent[todoId][selectedContentItem]
  }

  const {
    color = 'black',
    bold = false,
    italic = false,
    underline = false,
  } = { ...contentItem }

  // console.log(contentItem)

  const modify = (todoId, propsToModify) => {
    if (selectedContentItem === 'title') {
      changeTodoTitle(todoId, { ...propsToModify })
    } else {
      modifyTodoContent(todoId, { ...propsToModify })
    }
  }
  return (
    <div>
      <button
        style={{ backgroundColor: bold ? 'red' : 'transparent' }}
        onClick={() =>
          modify(todoId, {
            bold: !bold,
          })
        }>
        Ж
      </button>
      <button
        style={{ backgroundColor: italic ? 'red' : 'transparent' }}
        onClick={() =>
          modify(todoId, {
            italic: !italic,
          })
        }>
        К
      </button>
      <button
        style={{
          backgroundColor: underline ? 'red' : 'transparent',
        }}
        onClick={() =>
          modify(todoId, {
            underline: !underline,
          })
        }>
        Ч
      </button>
      <button
        style={{
          backgroundColor: color === 'red' ? 'red' : 'transparent',
        }}
        onClick={() =>
          modify(todoId, {
            color: 'red',
          })
        }>
        Красный
      </button>
      <button
        style={{
          backgroundColor: color === 'yellow' ? 'red' : 'transparent',
        }}
        onClick={() =>
          modify(todoId, {
            color: 'yellow',
          })
        }>
        Желтый
      </button>
      <button
        style={{
          backgroundColor: color === 'green' ? 'red' : 'transparent',
        }}
        onClick={() =>
          modify(todoId, {
            color: 'green',
          })
        }>
        Зеленый
      </button>
      <button
        style={{
          backgroundColor: color === 'black' ? 'red' : 'transparent',
        }}
        onClick={() =>
          modify(todoId, {
            color: 'black',
          })
        }>
        Без цвета
      </button>

      <button
        onClick={() =>
          modify(todoId, {
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
