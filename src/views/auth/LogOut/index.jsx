/* eslint-disable no-useless-constructor */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'

function LogOut() {
    useEffect(() => {
        document.title = 'Logout – WorkGroup'

        let logoutHeader = new Headers()
        logoutHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'DELETE',
            headers: logoutHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/auth/invalidate', requestOptions)
            .then((response) => {
                response.text()
            })
            .then((result) => {
                localStorage.clear()
                location.href = '/'
            })
    }, [])
    return (
        <div className="loginContainer">
            <span>Logging out...</span>
        </div>
    )
}

export default LogOut
