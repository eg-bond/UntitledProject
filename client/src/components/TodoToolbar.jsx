import React from 'react'

const TodoToolbar = ({ todoId, modifyTodoContent }) => {
  return (
    <div>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            bold: true,
          })
        }>
        Ж
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            italic: true,
          })
        }>
        К
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            underline: true,
          })
        }>
        Ч
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            color: 'red',
          })
        }>
        Красный
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            color: 'yellow',
          })
        }>
        Желтый
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            color: 'green',
          })
        }>
        Зеленый
      </button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            color: 'noth',
          })
        }>
        Без цвета
      </button>
      <button>Выделить</button>
      <button
        onClick={() =>
          modifyTodoContent(todoId, {
            color: 'noth',
            selectionClr: 'noth',
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
