import React from 'react';
import {Switch} from "react-router-dom";
import LoginForms from "./LoginForms";
import {login} from "../../redux/authReduser";
import {connect} from "react-redux";


const AuthPage = ({login}) => {

    const onSubmit = (formData) => {
        console.log(formData)
        login(formData)

    }

    return (
        <div>
            <LoginForms onSubmit={onSubmit}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, {login})(AuthPage);