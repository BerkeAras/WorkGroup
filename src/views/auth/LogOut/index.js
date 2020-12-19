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
import firebase from 'firebase'
import logo from '../../../static/logo.svg'

class LogOut extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        firebase
            .auth()
            .signOut()
            .then(() => {
                window.location.href = '/'
            })
            .catch((error) => {
                window.location.href = '/'
            })
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
