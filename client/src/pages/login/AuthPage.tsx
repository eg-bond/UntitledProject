import React from 'react'
import LoginForms from './LoginForms'
import { login } from '../../redux/authReduser'
import { connect } from 'react-redux'
import { AppStateType } from '../../redux/store'

const AuthPage: React.FC<mapStateToPropsType & mapDispatchToPropsType> = ({
  login,
}) => {
  const onSubmit = (formData: LoginFormDataType) => {
    login(formData)
  }

  return (
    <div>
      <LoginForms onSubmit={onSubmit} />
    </div>
  )
}

export type LoginFormDataType = {
  email: string
  pass: string
}
type mapStateToPropsType = {
  isAuth: boolean
}
type mapDispatchToPropsType = {
  login: (formData: LoginFormDataType) => void
}

const mapStateToProps = (state: AppStateType): mapStateToPropsType => ({
  //Нужен ли isAuth?
  isAuth: state.auth.isAuth,
})

export default connect<
  mapStateToPropsType,
  mapDispatchToPropsType,
  null,
  AppStateType
>(mapStateToProps, { login })(AuthPage)
