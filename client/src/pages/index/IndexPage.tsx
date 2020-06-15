import React from 'react'
import {connect} from "react-redux"
import {getAuthData} from "../../redux/authReduser"
import {AppStateType} from "../../redux/store"

const IndexPage: React.FC<MapStateToPropsType & MapDispatchToPropsType> = ({name, lastname, getAuthData}) => {

    const getUserId = () => {
        //@ts-ignore
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

type MapStateToPropsType = {
    name: string | null,
    lastname: string | null
}
type MapDispatchToPropsType = {
    getAuthData: (token: string) => void
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => ({
    name: state.auth.name,
    lastname: state.auth.lastname
})


export default connect<MapStateToPropsType, MapDispatchToPropsType, null ,AppStateType>(mapStateToProps, {getAuthData})(IndexPage);