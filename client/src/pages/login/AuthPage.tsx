import React from 'react';
import LoginForms from "./LoginForms";
import {login} from "../../redux/authReduser";
import {connect} from "react-redux";
import {AppStateType} from "../../redux/store";


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


const AuthPage: React.FC<mapStateToPropsType & mapDispatchToPropsType> = ({login}) => {

    const onSubmit = (formData: LoginFormDataType) => {
        login(formData)
    }

    return (
        <div>
            <LoginForms onSubmit={onSubmit}/>
        </div>
    );
}


const mapStateToProps = (state: AppStateType): mapStateToPropsType => ({ //Нужен ли isAuth?
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, {login})(AuthPage);