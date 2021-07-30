import React, { useEffect, useState } from 'react'
import { connect, useStore } from 'react-redux'
import { compose } from 'redux'
import { AppStateType } from '../../redux/store'
import { actions, TodoInitialStateType } from '../../redux/todoReduser'
import { useParams, useHistory, withRouter } from 'react-router-dom'
import { todoAPI } from '../../api/api'
import ToDoPageNew from './ToDoPageNew'

const ToDoPageContainer: React.FC<
  MapStateToPropsType & MapDispatchToPropsType & WithRouterPropsType
> = ({
  // todoListArr,
  todoTitles,
  selectedTodo,
  todoContent,
  currentTodoId,
  addTodo,
  deleteTodo,
  addTodoContentItem,
  deleteTodoContentItem,
  selectTodo,
  selectContentItem,
  modifyTodoContent,
  ...props
}) => {
  let history = useHistory()
  // @ts-ignore
  let { todoId } = useParams()
  let currentStore = useStore()

  const deleteTodoHandler = (thisTodoId: string) => {
    if (todoId === thisTodoId) {
      let idArr = Object.keys(todoTitles)
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
  type ContentItemType = {
    value: string
    importance: string
    orderNum: number
  }
  type BodyType = {
    idGenerator: number
    todoListArr: Array<{ title: string; id: string }>
    todoContentObj: {
      [key: string]: Array<ContentItemType>
    }
  }

  useEffect(() => {
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
    <ToDoPageNew
      // todoListArr={todoListArr}
      todoTitles={todoTitles}
      todoContent={todoContent}
      selectedTodo={selectedTodo}
      currentTodoId={currentTodoId}
      addTodo={addTodo}
      deleteTodo={deleteTodo}
      addTodoContentItem={addTodoContentItem}
      deleteTodoContentItem={deleteTodoContentItem}
      selectTodo={selectTodo}
      selectContentItem={selectContentItem}
      modifyTodoContent={modifyTodoContent}
      changeTodoTitle={props.changeTodoTitle}
      deleteTodoHandler={deleteTodoHandler}
    />
  )
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
  idGenerator: state.todo.idGenerator,
  todoTitles: state.todo.todoTitles,
  todoContent: state.todo.todoContent,
  currentTodoId: state.todo.currentTodoId,
  selectedContentItem: state.todo.selectedContentItem,
})

export default compose(
  connect<
    MapStateToPropsType,
    MapDispatchToPropsType,
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
export type MapStateToPropsType = {
  idGenerator?: number
  todoListArr: TodoInitialStateType['todoListArr']
  todoContentObj?: TodoInitialStateType['todoContentObj']
  selectedTodo: TodoInitialStateType['selectedTodo']
}
export type MapDispatchToPropsType = {
  addTodo: () => void
  deleteTodo: (todoId: string) => void
  addTodoContentItem: (
    todoId: string,
    value: string,
    importance: string
  ) => void
  deleteTodoContentItem: (todoId: string, orderNum: number) => void
  selectTodo: (todoId: string) => void
  changeTodoTitle: (todoId: string, title: string) => void
  modifyTodoContent: (
    todoId: string,
    value: string,
    importance: string,
    orderNum: number
  ) => void
}
