/* eslint-disable no-useless-constructor */
import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom'
import './style.scss'
import { Button, Input, Message } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'

class LogOut extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        
        var logoutHeader = new Headers();
        logoutHeader.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjExODIyNTE2LCJleHAiOjE2MTE4MjYxMTYsIm5iZiI6MTYxMTgyMjUxNiwianRpIjoiYjgzMDk0MjVlMzc2OTQ0MjFhMTJiZTViYzQxNzM0YjkifQ.txTZk_2ydrOAdjWYxQdMUB_cyjsCmTmKFVHVe56wGF4");

        var requestOptions = {
            method: 'DELETE',
            headers: logoutHeader,
            redirect: 'follow'
        };

        fetch("http://localhost:8000/api/auth/invalidate", requestOptions)
            .then(response => response.text())
            .then(result => {
                localStorage.clear();
                location.href = "/";
            })
            .catch(error => console.log('error', error));

    }

    render() {
        return (
            <div className="loginContainer">
                <span>Logging out...</span>
            </div>
        )
    }
}
export default LogOut
