import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps, useStore } from 'react-redux'
import { AppStateType } from '../../redux/store'
import { actions, TodoInitialStateT } from '../../redux/todoReduser'
import { useParams, useHistory } from 'react-router-dom'
import { todoAPI } from '../../api/api'
import ToDoPage from './ToDoPage'
import TodoToolbar from '../../components/TodoToolbar'

const ToDoPageContainer: React.FC<TodoReduxPropsT> = ({
  idGenerator,
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
  let currentTodoState: TodoInitialStateT = useStore().getState().todo
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

  const objectsIsNotEqual = (obj1: any, obj2: any) => {
    let keys = Object.keys(obj1)
    return keys.some(
      key => JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])
    )
  }
  let currentStore = {
    idGenerator: currentTodoState.idGenerator,
    todoContent: currentTodoState.todoContent,
    todoTitles: currentTodoState.todoTitles,
  }
  // if (true) {
  //   throw Error('')
  // }
  const [synchronizedWithLS, syncWithLS] = useState(false)

  const getTodosFromServer = async () => {
    let { todoData } = await todoAPI.getTodo()

    if (!localStorage.todoData) {
      localStorage.todoData = JSON.stringify(todoData)
    }

    if (!!localStorage.todoData) {
      if (objectsIsNotEqual(todoData, JSON.parse(localStorage.todoData))) {
        localStorage.todoData = JSON.stringify(todoData)
      }
    }

    props.setInitialTodoData(JSON.parse(localStorage.todoData))
    syncWithLS(true)
  }

  // const LStodoData = localStorage.todoData
  // const { token } = localStorage.userData
  // console.log(LStodoData)
  // console.log(token)

  useEffect(() => {
    // Загружаем данные из LocalStorage в стейт после вмонтирования компоненты
    getTodosFromServer()

    // if (idArr[0]) {
    //   history.push(`/todo/${idArr[0]}`)
    // }

    return () => {
      // let currentTodoState = currentStore.getState().todo
      // let body = {
      //   idGenerator: currentTodoState.idGenerator,
      //   todoListArr: currentTodoState.todoListArr,
      //   todoContentObj: currentTodoState.todoContentObj,
      // }
      todoAPI.syncTodo()
      selectTodo(null)
      selectContentItem(null)
    }
  }, [])

  //state changed and need to be placed in LS
  useEffect(() => {
    if (synchronizedWithLS) {
      localStorage.todoData = JSON.stringify({
        idGenerator,
        todoTitles,
        todoContent,
      })

      todoAPI.syncTodo()
    }
  }, [todoTitles, todoContent])

  // state.currentTodoId = todoId
  useEffect(() => {
    selectTodo(todoId)
  }, [todoId])

  // //Вынести в отдельную компоненту или HOC
  // useEffect(() => {
  //   todoAPI.syncTodo()
  // }, [localStorage.todoData])

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
  idGenerator: state.todo.idGenerator,
  todoTitles: state.todo.todoTitles,
  todoContent: state.todo.todoContent,
  currentTodoId: state.todo.currentTodoId,
  selectedContentItem: state.todo.selectedContentItem,
})

const mapDispatchToProps = {
  setInitialTodoData: actions.setInitialTodoData,
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
