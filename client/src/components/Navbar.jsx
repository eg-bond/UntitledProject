import React from 'react';
import {NavLink} from "react-router-dom";

const Navbar = ({isAuth, logout, name, lastname}) => {

    if (isAuth) {
        return (
            <div>
                <div className='navbar'>
                    <div className='navbar__segment'>
                        <NavLink className='navbar__item' to="/" exact>Index</NavLink>
                        <NavLink className='navbar__item' to="todo" exact>Todo</NavLink>
                        <NavLink className='navbar__item' to="diary" exact>Diary</NavLink>
                    </div>
                    <div className='navbar__segment'>
                        Center
                    </div>
                    <div className='navbar__segment'>
                        <span>{`${name} ${lastname}`}</span>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
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