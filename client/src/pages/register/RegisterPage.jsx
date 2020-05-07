import React from 'react';
import {Switch} from "react-router-dom";
import RegisterForms from "./RegisterForms";
import {compose} from "redux";
import {connect} from "react-redux";

const RegisterPage = () => {

    const onSubmit = (formData) => {
        // console.log(formData)
        const body = JSON.stringify(formData)
        fetch('/api/auth/register', {method:'POST', body, headers: {'Content-Type': 'application/json'} })
            .then(console.log('done'))
    }

    return (
        <div>
            <h1>RegisterPage</h1>
            <RegisterForms onSubmit={onSubmit}/>
        </div>
    );
}

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
});

export default compose(
    connect(mapStateToProps)
)(RegisterPage);

// export default RegisterPage;