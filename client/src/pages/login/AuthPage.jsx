import React from 'react';
import {Switch} from "react-router-dom";
import LoginForms from "./LoginForms";
import {authAPI} from "../../api/api";
import {login} from "../../redux/authReduser";
import {connect} from "react-redux";

const AuthPage = ({login}) => {

    const onSubmit = (formData) => {
        // authAPI.login(formData)
        //     .then(res => res.userId !== undefined && login(res.token, res.userId, res.name, res.lastname, res.nickname, res.email))
        login(formData)
    }

    return (
        <div>
            <h1>AuthPage</h1>
            <LoginForms onSubmit={onSubmit}/>
        </div>
    );
}

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, {login})(AuthPage);