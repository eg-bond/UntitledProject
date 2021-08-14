import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps, useStore } from 'react-redux'
import { AppStateType } from '../../redux/store'
import { actions, TodoInitialStateT } from '../../redux/todoReduser'
import { useParams, useHistory } from 'react-router-dom'
import { todoAPI } from '../../api/api'
import ToDoPage from './ToDoPage'
import TodoToolbar from '../../components/TodoToolbar'
import { handleLSData, handleLSDataDebounceP } from '../../helpers/helpers'

export function useDebounce(value, delay) {
  // Состояние и сеттер для отложенного значения
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      // Выставить debouncedValue равным value (переданное значение)
      // после заданной задержки
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Вернуть функцию очистки, которая будет вызываться каждый раз, когда ...
      // ... useEffect вызван снова. useEffect будет вызван снова, только если ...
      // ... value будет изменено (смотри ниже массив зависимостей).
      // Так мы избегаем изменений debouncedValue, если значение value ...
      // ... поменялось в рамках интервала задержки.
      // Таймаут очищается и стартует снова.
      // Что бы сложить это воедино: если пользователь печатает что-то внутри ...
      // ... нашего приложения в поле поиска, мы не хотим, чтобы debouncedValue...
      // ... не менялось до тех пор, пока он не прекратит печатать дольше, чем 500ms.
      return () => {
        clearTimeout(handler)
      }
    },
    // Вызывается снова, только если значение изменится
    // мы так же можем добавить переменную "delay" в массива зависимостей ...
    // ... если вы собираетесь менять ее динамически.
    [value]
  )

  return debouncedValue
}

// export function useDebounceFn(fn, delay) {
//   const [call, setCall] = useState(false)
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setCall(true)
//     }, delay)

//     return () => {
//       clearTimeout(handler)
//     }
//   }, [fn])

//   if (call) {
//   }
// }

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
  // let currentTodoState: TodoInitialStateT = useStore().getState().todo
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

  // let currentStore = {
  //   idGenerator: currentTodoState.idGenerator,
  //   todoContent: currentTodoState.todoContent,
  //   todoTitles: currentTodoState.todoTitles,
  // }
  // if (true) {
  //   throw Error('')
  // }

  // Tells< that
  const [synchronizedWithLS, syncWithLS] = useState(false)

  const getTodosFromServer = async () => {
    let { todoData } = await todoAPI.getTodo()

    if (!localStorage.todoData) {
      handleLSData('set', 'todoData', todoData)
    } else {
      let { lastUpdate } = handleLSData('get', 'todoData')
      // LS data outdated
      if (todoData.lastUpdate > lastUpdate) {
        debugger
        handleLSData('set', 'todoData', todoData)
      }
      // DB data outdated
      if (todoData.lastUpdate < lastUpdate) {
        debugger
        todoAPI.syncTodo()
      }
    }
    return Promise.resolve()
  }

  useEffect(() => {
    // Загружаем данные из LocalStorage в стейт после вмонтирования компоненты
    getTodosFromServer().then(() => {
      props.setInitialTodoData(handleLSData('get', 'todoData'))
      syncWithLS(true)
    })

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
      handleLSDataDebounceP('set', 'todoData', {
        idGenerator,
        todoTitles,
        todoContent,
      }).then(() => console.log('done'))

      // delayedLSDataHandler('set', 'test', todoTitles)
      // todoAPI.syncTodo()
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
