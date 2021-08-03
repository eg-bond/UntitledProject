import React, { useEffect } from 'react'
import { connect, useStore } from 'react-redux'
import { compose } from 'redux'
import { AppStateType } from '../../redux/store'
import {
  actions,
  TodoActionsT,
  TodoInitialStateT,
  TodoItemPropsT,
} from '../../redux/todoReduser'
import { useParams, useHistory, withRouter } from 'react-router-dom'
import { todoAPI } from '../../api/api'
import TodoToolbar from '../../components/TodoToolbar'
import ToDoPage from './ToDoPage'

const ToDoPageContainer: React.FC<
  MapStateToPropsT & MapDispatchToPropsT & WithRouterPropsType
> = ({
  todoTitles,
  todoContent,
  currentTodoId,
  selectedContentItem,
  addTodo,
  deleteTodo,
  modifyTodoContent,
  ...props
}) => {
  let history = useHistory()
  // @ts-ignore
  let { todoId } = useParams()
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

      idArr.length > 1 ? nextTodoUrl() : emptyTodoUrl()
    }

    deleteTodo(thisTodoId)
  }

  useEffect(() => {
    if (idArr[0]) {
      history.push(`/todo/${idArr[0]}`)
    }

    return () => {
      let currentTodoState = currentStore.getState().todo

      let body = {
        idGenerator: currentTodoState.idGenerator,
        todoListArr: currentTodoState.todoListArr,
        todoContentObj: currentTodoState.todoContentObj,
      }
      todoAPI.syncTodo(body)
    }
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
        todoTitles={todoTitles}
        todoContent={todoContent}
        currentTodoId={currentTodoId}
        addTodo={addTodo}
        deleteTodo={deleteTodo}
        addTodoContentItem={props.addTodoContentItem}
        deleteTodoContentItem={props.deleteTodoContentItem}
        selectTodo={props.selectTodo}
        selectContentItem={props.selectContentItem}
        modifyTodoContent={modifyTodoContent}
        changeTodoTitle={props.changeTodoTitle}
        deleteTodoHandler={deleteTodoHandler}
      />
    </>
  )
}

const mapStateToProps = (state: AppStateType): MapStateToPropsT => ({
  todoTitles: state.todo.todoTitles,
  todoContent: state.todo.todoContent,
  currentTodoId: state.todo.currentTodoId,
  selectedContentItem: state.todo.selectedContentItem,
})

export default compose(
  connect<
    MapStateToPropsT,
    MapDispatchToPropsT,
    WithRouterPropsType,
    AppStateType
  >(mapStateToProps, {
    addTodo: actions.addTodo,
    deleteTodo: actions.deleteTodo,
    addTodoContentItem: actions.addTodoContentItem,
    deleteTodoContentItem: actions.deleteTodoContentItem,
    selectTodo: actions.selectTodo,
    selectContentItem: actions.selectContentItem,
    changeTodoTitle: actions.changeTodoTitle,
    modifyTodoContent: actions.modifyTodoContent,
  }),
  withRouter
)(ToDoPageContainer)

type WithRouterPropsType = {
  match: any
  history: Array<string>
}
export type MapStateToPropsT = {
  todoTitles: TodoInitialStateT['todoTitles']
  todoContent: TodoInitialStateT['todoContent']
  currentTodoId: TodoInitialStateT['currentTodoId']
  selectedContentItem?: TodoInitialStateT['selectedContentItem']
}
export type MapDispatchToPropsT = {
  addTodo: typeof actions.addTodo
  // addTodo: TodoActionsT['addTodo']
  deleteTodo: TodoActionsT['deleteTodo']
  addTodoContentItem: TodoActionsT['addTodoContentItem']
  deleteTodoContentItem: TodoActionsT['deleteTodoContentItem']
  selectTodo: TodoActionsT['selectTodo']
  selectContentItem: typeof actions.selectContentItem
  // selectContentItem: TodoActionsT['selectContentItem']
  changeTodoTitle: TodoActionsT['changeTodoTitle']
  modifyTodoContent: TodoActionsT['modifyTodoContent']
}
