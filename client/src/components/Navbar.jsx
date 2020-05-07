import React from 'react';
import {NavLink, Switch} from "react-router-dom";

const Navbar = ({isAuth, logout}) => {

    if (isAuth) {
        return (
            <div>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <NavLink to="/">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
        </div>
    )


}

export default Navbar;