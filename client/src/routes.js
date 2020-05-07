import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import IndexPage from "./pages/index/IndexPage";
import RegisterPage from "./pages/register/RegisterPage";
import AuthPage from "./pages/login/AuthPage";

export const useRoutes = isAuth => {

    if (isAuth) {
        return (
            <Switch>
                <Route path="/" exact><IndexPage/></Route>
                <Redirect to="/" exact/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/register"><RegisterPage/></Route>
            <Route path="/" exact><AuthPage/></Route>
            <Redirect to="/"/>
        </Switch>
    )
}