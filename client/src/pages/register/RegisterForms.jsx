import React from 'react';
import {Field, reduxForm} from "redux-form";
import {requiredField, maxLength, minLength, alphaNumeric, onlyLetters, email} from "../../utils/validators/validators";

const renderField = ({
                         input,
                         label,
                         type,
                         meta: { touched, error, warning }
                     }) => (
    <div>
        <span>{label}</span>
        <div>
            <input {...input} placeholder={label} type={type} />
            {touched &&
            ((error && <span>{error}</span>) ||
                (warning && <span>{warning}</span>))}
        </div>
    </div>
)


const RegisterForms = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
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