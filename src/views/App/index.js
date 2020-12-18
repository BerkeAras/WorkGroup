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
import logo from '../../static/logo.svg'
import { Button, Input } from 'semantic-ui-react'
import firebase from 'firebase'

// Components
import Sidebar from '../../components/Sidebar/'
import Header from '../../components/Header/'

class MainApp extends React.Component {
    constructor(props) {
        super(props)

        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = '/'
            }
        })
    }

    render() {
        return (
            <div className="app">
                <Header></Header>
                <Sidebar></Sidebar>
            </div>
        )
    }
}
export default MainApp
