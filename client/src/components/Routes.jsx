import React from 'react'
import IndexPage from '../pages/index/IndexPage'
import RegisterPage from '../pages/register/RegisterPage'
import AuthPage from '../pages/login/AuthPage'
import { Redirect, Route, Switch } from 'react-router-dom'
import ToDoPage from '../pages/todo/ToDoPage'
// import ToDoPageWithLocalContent from "../pages/todo/ToDoPageWithLocalContent";
import EditorPage from '../pages/editor/EditorPage'
import ToDoPageContainer from '../pages/todo/ToDoPageContainer'
import TodoToolbar from './TodoToolbar'

export const Routes = ({ isAuth }) => {
  if (isAuth) {
    return (
      <Switch>
        <Route path='/' exact>
          <EditorPage />
        </Route>

        {/* <Route path='/' exact>
          <IndexPage />
        </Route> */}

        {/* <Route path="/todo/:todoId?"><ToDoPage/></Route> */}
        <Route path='/todo/:todoId?'>
          <ToDoPageContainer />
        </Route>
        <Route path='/editor'>
          <EditorPage />
        </Route>
        <Redirect to='/' exact />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path='/register'>
        <RegisterPage />
      </Route>
      <Route path='/' exact>
        <AuthPage />
      </Route>
      <Redirect to='/' />
    </Switch>
  )
}
