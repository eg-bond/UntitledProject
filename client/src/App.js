import React, {useEffect} from 'react';
import './App.css';
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {getAuthData, logout} from "./redux/authReduser";
import {Loader} from "./components/Loader";
import 'materialize-css';
import Navbar from "./components/Navbar";
import {Routes} from "./components/Routes";

const App = ({isAuth, logout, getAuthData, isFetching}) => {

    //if token in LS exists - get userData from server
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('userData'))
        if (!!token) {
            getAuthData(token)
        }
    }, [])


    if (isFetching) {
        return <Loader/>
    }

    return (
        <div className="container">
            <Navbar isAuth={isAuth} logout={logout}/>
            <Routes isAuth={isAuth}/>
        </div>
    );
}


const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    isFetching: state.auth.isFetching
})

export default connect(mapStateToProps, {logout, getAuthData})(App);


