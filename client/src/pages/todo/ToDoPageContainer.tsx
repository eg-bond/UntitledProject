import React, { useEffect } from 'react'
import { connect, ConnectedProps, useStore } from 'react-redux'
import { AppStateType } from '../../redux/store'
import { actions } from '../../redux/todoReduser'
import { useParams, useHistory } from 'react-router-dom'
import { todoAPI } from '../../api/api'
import ToDoPage from './ToDoPage'
import TodoToolbar from '../../components/TodoToolbar'

const ToDoPageContainer: React.FC<TodoReduxPropsT> = ({
  todoTitles,
  todoContent,
  currentTodoId,
  selectedContentItem,
  addTodo,
  deleteTodo,
  selectTodo,
  selectContentItem,
  modifyTodoContent,
  ...props
}) => {
  let history = useHistory()
  let { todoId } = useParams<{ todoId: string }>()
  let currentStore = useStore()
  let idArr = Object.keys(todoTitles)

  const deleteTodoHandler = (thisTodoId: string) => {
    if (todoId === thisTodoId) {
      let index = idArr.findIndex(item => item === thisTodoId)

      let nextTodoUrl = () =>
        index === 0
          ? history.push(`/todo/${idArr[index + 1]}`)
          : history.push(`/todo/${idArr[index - 1]}`)
      let emptyTodoUrl = () => history.push(`/todo`)

      const noTodosHandler = () => {
        selectTodo(null)
        selectContentItem(null)
        emptyTodoUrl()
      }

      idArr.length > 1 ? nextTodoUrl() : noTodosHandler()
    }

    deleteTodo(thisTodoId)
  }

  // state.currentTodoId = todoId
  useEffect(() => {
    selectTodo(todoId)
  }, [todoId])

  useEffect(() => {
    if (idArr[0]) {
      history.push(`/todo/${idArr[0]}`)
    }

    // return () => {
    //   let currentTodoState = currentStore.getState().todo

    //   let body = {
    //     idGenerator: currentTodoState.idGenerator,
    //     todoListArr: currentTodoState.todoListArr,
    //     todoContentObj: currentTodoState.todoContentObj,
    //   }
    //   todoAPI.syncTodo(body)
    // }
  }, [])

  return (
    <>
      <TodoToolbar
        todoId={todoId}
        todoContent={todoContent}
        todoTitles={todoTitles}
        selectedContentItem={selectedContentItem}
        modifyTodoContent={modifyTodoContent}
        changeTodoTitle={props.changeTodoTitle}
      />
      <ToDoPage
        todoId={todoId}
        todoTitles={todoTitles}
        todoContent={todoContent}
        currentTodoId={currentTodoId}
        addTodo={addTodo}
        deleteTodo={deleteTodo}
        addTodoContentItem={props.addTodoContentItem}
        deleteTodoContentItem={props.deleteTodoContentItem}
        selectTodo={selectTodo}
        selectContentItem={selectContentItem}
        modifyTodoContent={modifyTodoContent}
        changeTodoTitle={props.changeTodoTitle}
        deleteTodoHandler={deleteTodoHandler}
      />
    </>
  )
}

const mapStateToProps = (state: AppStateType) => ({
  todoTitles: state.todo.todoTitles,
  todoContent: state.todo.todoContent,
  currentTodoId: state.todo.currentTodoId,
  selectedContentItem: state.todo.selectedContentItem,
})

const mapDispatchToProps = {
  addTodo: actions.addTodo,
  deleteTodo: actions.deleteTodo,
  addTodoContentItem: actions.addTodoContentItem,
  deleteTodoContentItem: actions.deleteTodoContentItem,
  selectTodo: actions.selectTodo,
  selectContentItem: actions.selectContentItem,
  changeTodoTitle: actions.changeTodoTitle,
  modifyTodoContent: actions.modifyTodoContent,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
export type TodoReduxPropsT = ConnectedProps<typeof connector>

export default connector(ToDoPageContainer)
