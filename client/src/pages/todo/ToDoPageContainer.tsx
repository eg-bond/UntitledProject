import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps, useStore } from 'react-redux'
import { AppStateType } from '../../redux/store'
import { todoActions } from '../../redux/todoReduser'
import { useParams, useHistory } from 'react-router-dom'
import { DB_TodoDataT, todoAPI } from '../../api/api'
import ToDoPage from './ToDoPage'
import TodoToolbar from '../../components/TodoToolbar'
import { handleLSData, setLSDataDebounceP } from '../../helpers/helpers'

const ToDoPageContainer: React.FC<TodoReduxPropsT> = ({
  idGenerator,
  todoTitles,
  todoContent,
  currentTodoId,
  selectedContentItem,
  lastUpdate,
  addTodo,
  deleteTodo,
  selectTodo,
  selectContentItem,
  modifyTodoContent,
  ...props
}) => {
  let history = useHistory()
  let { todoId } = useParams<{ todoId: string }>()
  let idArr = Object.keys(todoTitles)

  // Оптимизировать и убрать
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

  // Сделать переиспользуемой и вынести
  const getTodosFromServer = async () => {
    let { todoData } = await todoAPI.getTodo()

    if (!localStorage.todoData) {
      handleLSData.set('todoData', todoData)
    } else {
      let { lastUpdate } = handleLSData.get<DB_TodoDataT>('todoData')
      // LS data outdated
      if (todoData.lastUpdate > lastUpdate) {
        debugger
        handleLSData.set('todoData', { ...todoData, lastUpdate: 0 })
      }
      // DB data outdated
      if (todoData.lastUpdate < lastUpdate) {
        debugger
        todoAPI.syncTodo()
      }
    }
    return Promise.resolve()
  }

  // Swithces to "true" after initial LS->state sunchronization
  // and enables LS->DB sunc if LS data changed
  const [synchronizedWithLS, syncWithLS] = useState(false)

  useEffect(() => {
    // Fill state with LS data after initial component mount
    getTodosFromServer().then(() => {
      props.setInitialTodoData(handleLSData.get<DB_TodoDataT>('todoData'))
      syncWithLS(true)
    })

    return () => {
      todoAPI.syncTodo()
      selectTodo(null)
      selectContentItem(null)
    }
  }, [])

  // update LS after state change (with debouce delay)
  useEffect(() => {
    if (synchronizedWithLS) {
      setLSDataDebounceP('todoData', {
        idGenerator,
        todoTitles,
        todoContent,
        lastUpdate,
      }).then(() => todoAPI.syncTodo())
    }
  }, [todoTitles, todoContent])

  // change state.currentTodoId if url changed
  useEffect(() => {
    selectTodo(todoId)
  }, [todoId])

  return (
    <>
      <TodoToolbar
        todoId={todoId}
        todoContent={todoContent}
        todoTitles={todoTitles}
        selectedContentItem={selectedContentItem}
        modifyTodoContent={modifyTodoContent}
        modifyTodoTitle={props.modifyTodoTitle}
      />
      <ToDoPage
        todoId={todoId}
        todoTitles={todoTitles}
        todoContent={todoContent}
        currentTodoId={currentTodoId}
        selectedContentItem={selectedContentItem}
        addTodo={addTodo}
        deleteTodo={deleteTodo}
        addTodoContentItem={props.addTodoContentItem}
        deleteTodoContentItem={props.deleteTodoContentItem}
        selectTodo={selectTodo}
        selectContentItem={selectContentItem}
        modifyTodoContent={modifyTodoContent}
        modifyTodoTitle={props.modifyTodoTitle}
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
  lastUpdate: state.todo.lastUpdate,
})

const mapDispatchToProps = {
  setInitialTodoData: todoActions.setInitialTodoData,
  addTodo: todoActions.addTodo,
  deleteTodo: todoActions.deleteTodo,
  addTodoContentItem: todoActions.addTodoContentItem,
  deleteTodoContentItem: todoActions.deleteTodoContentItem,
  selectTodo: todoActions.selectTodo,
  selectContentItem: todoActions.selectContentItem,
  modifyTodoTitle: todoActions.modifyTodoTitle,
  modifyTodoContent: todoActions.modifyTodoContent,
}

const connector = connect(mapStateToProps, mapDispatchToProps)
export type TodoReduxPropsT = ConnectedProps<typeof connector>

export default connector(ToDoPageContainer)
