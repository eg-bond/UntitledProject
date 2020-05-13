import React, {useEffect} from 'react';
import {Field, reduxForm} from "redux-form";
import {requiredField, maxLength, minLength, alphaNumeric, onlyLetters, email} from "../../utils/validators/validators";
import {NavLink} from "react-router-dom";
import * as M from "materialize-css";

const renderField = ({
                         input,
                         label,
                         placeholder,
                         type,
                         meta: { touched, error, warning }
                     }) => (
    <div>
        <span>{label}</span>
        <div>
            <input {...input} placeholder={placeholder} type={type} />
            {touched &&
            ((error && <span>{error}</span>) ||
                (warning && <span>{warning}</span>))}
        </div>
    </div>
)



const RegisterForms = (props) => {

    return (
        <form onSubmit={props.handleSubmit}>
            <div className='row'>
                <div className="col s12 m8 l6 xl4 offset-m2  offset-l3 offset-xl4">
                    <div className="card brown">
                        <div className="card-content white-text">

                            <span className="card-title">Регистрация</span>

                            <div className="input-field">
                                <Field name={"name"} label={'Name'} placeholder={'Enter name'} component={renderField} type='text'
                                       validate={[requiredField, maxLength(15), onlyLetters]}/>
                            </div>




                            <div>
                                <Field className={'validate'} label={"Last name"} name={"lastname"} component={renderField}
                                       validate={[requiredField, maxLength(25), onlyLetters]}/>
                            </div>
                            <div>
                                <Field label={"Nickname"} name={"nickname"} component={renderField}
                                       validate={[requiredField, alphaNumeric]}/>
                            </div>
                            <div>
                                <Field label={"Email"} name={"email"} component={renderField}
                                       validate={[requiredField, email]}/>
                            </div>
                            <div>
                                <Field label={"Pass"} name={"pass"} component={renderField} type="password"
                                       validate={[requiredField, minLength(8)]}/>
                            </div>


                            <div className="input-field">
                                <Field id={'pass'} name={"pass"} component="input" type="password"/>
                                <label htmlFor="pass">Pass</label>
                            </div>

                            <div>
                                <div>
                                    <button onClick={() => {}} className="btn login auth__button" type="submit" name="action">Зарегистрироваться</button>
                                </div>
                                <div className='center auth__createLink'>
                                    <span>У вас есть аккаунт? </span><NavLink className={'auth__createLink_a'} to="/">Войти</NavLink>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Field name={"name"} label={"Name"} component={renderField}
                       validate={[requiredField, maxLength(15), onlyLetters]}/>
            </div>
            <div>
                <Field label={"Last name"} name={"lastname"} component={renderField}
                       validate={[requiredField, maxLength(25), onlyLetters]}/>
            </div>
            <div>
                <Field label={"Nickname"} name={"nickname"} component={renderField}
                       validate={[requiredField, alphaNumeric]}/>
            </div>
            <div>
                <Field label={"Email"} name={"email"} component={renderField}
                       validate={[requiredField, email]}/>
            </div>
            <div>
                <Field label={"Pass"} name={"pass"} component={renderField} type="password"
                       validate={[requiredField, minLength(8)]}/>
            </div>
            <div>
                <button onClick={() => {}}>Submit</button>
            </div>
        </form>
    );
}

const RegisterFormsReduxForm = reduxForm({
    form: 'register-form'
})(RegisterForms)

export default RegisterFormsReduxForm;