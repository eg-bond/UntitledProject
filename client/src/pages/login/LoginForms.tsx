import React from 'react'
import {Field, InjectedFormProps, reduxForm} from "redux-form"
import {NavLink} from "react-router-dom"
import {LoginFormDataType} from "./AuthPage"

const LoginForms: React.FC<InjectedFormProps<LoginFormDataType>> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div className='row'>
                <div className="col s12 m8 l6 xl4 offset-m2  offset-l3 offset-xl4">
                    <div className="card brown">
                        <div className="card-content white-text">

                            <span className="card-title">Авторизация</span>
                            <div className="input-field">
                                <Field className={'orange-input'} id={'email'} name={"email"} component="input" type='text'/>
                                <label htmlFor='email'>Email</label>
                            </div>
                            <div className="input-field">
                                <Field className={'orange-input'} id={'pass'} name={"pass"} component="input" type="password"/>
                                <label htmlFor="pass">Pass</label>
                            </div>

                            <div>
                                <div>
                                    <button onClick={() => {}} className="btn login auth__button" type="submit" name="action">Войти</button>
                                </div>
                                <div className='center auth__createLink'>
                                    <span>У вас нет аккаунта? </span><NavLink className={'auth__createLink_a'} to="/register">Создать аккаунт</NavLink>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

const LoginFormsReduxForm = reduxForm<LoginFormDataType>({
    form: 'login-form'
})(LoginForms)

export default LoginFormsReduxForm;