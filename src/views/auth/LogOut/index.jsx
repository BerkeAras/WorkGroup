/* eslint-disable no-useless-constructor */
import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'

class LogOut extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var logoutHeader = new Headers()
        logoutHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'DELETE',
            headers: logoutHeader,
            redirect: 'follow',
        }

        fetch('http://localhost:8000/api/auth/invalidate', requestOptions)
            .then((response) => {
                response.text()
            })
            .then((result) => {
                localStorage.clear()
                location.href = '/'
            })
            .catch((error) => console.log('error', error))
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
