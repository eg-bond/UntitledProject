import React from 'react';
import {connect} from "react-redux";
import {getAuthData} from "../../redux/authReduser";

const IndexPage = ({name, lastname, getAuthData}) => {

    const getUserId = () => {
        const token = JSON.parse(localStorage.getItem('userData'))
        getAuthData(token)
    }

    return (
        <div>
            <h1>IndexPage</h1>
            <p>Welcome {`${name} ${lastname}`}</p>
            <button onClick={getUserId}>Get userId</button>
        </div>
    );
}

const mapStateToProps = (state) => ({
    name: state.auth.name,
    lastname: state.auth.lastname,
    token: state.auth.token
})


export default connect(mapStateToProps, {getAuthData})(IndexPage);