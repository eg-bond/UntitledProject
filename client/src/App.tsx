import React, { useEffect } from 'react'
import './App.css'
import { connect } from 'react-redux'
import { getAuthData, authActions } from './redux/authReduser'
import { Loader } from './components/Loader'
import 'materialize-css'
import Navbar from './components/Navbar'
import { Routes } from './components/Routes'
import { AppStateType } from './redux/store'

const App: React.FC<mapStateToPropsType & mapDispatchToPropsType> = ({
  isAuth,
  logout,
  name,
  lastname,
  getAuthData,
  isFetching,
}) => {
  //if token in LS exists - get userData from server

  useEffect(() => {
    // @ts-ignore
    let token
    if (!!localStorage.userData) {
      token = JSON.parse(localStorage.userData)
    }
    if (!!token) {
      getAuthData(token)
    }
  }, [])

  if (isFetching) {
    return <Loader />
  }

  return (
    <div>
      <Navbar isAuth={isAuth} logout={logout} name={name} lastname={lastname} />
      <div>
        <Routes isAuth={isAuth} />
      </div>
    </div>
  )
}

type mapStateToPropsType = {
  name: string | null
  lastname: string | null
  isAuth: boolean
  isFetching: boolean
}
type mapDispatchToPropsType = {
  logout: () => void
  getAuthData: (token: string) => void
}

const mapStateToProps = (state: AppStateType): mapStateToPropsType => ({
  name: state.auth.name,
  lastname: state.auth.lastname,
  isAuth: state.auth.isAuth,
  isFetching: state.auth.isFetching,
})

export default connect(mapStateToProps, {
  logout: authActions.logout,
  getAuthData,
})(App)
