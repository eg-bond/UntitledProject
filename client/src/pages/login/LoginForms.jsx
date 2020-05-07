import React from 'react';
import {Field, reduxForm} from "redux-form";

const LoginForms = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
                <b>Email</b><Field placeholder={"Email"} name={"email"} component="input"/>
            </div>
            <div>
                <b>Pass</b><Field placeholder={"Pass"} name={"pass"} component="input" type="password"/>
            </div>
            <div>
                <button onClick={() => {}}>Login</button>
            </div>
        </form>
    );
}

const LoginFormsReduxForm = reduxForm({
    form: 'login-form'
})(LoginForms)

export default LoginFormsReduxForm;