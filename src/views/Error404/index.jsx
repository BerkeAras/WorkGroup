/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button } from 'semantic-ui-react'
import { AlertTriangle } from 'react-feather'

// Components
import Header from '../../components/Header'

function Error404() {
    useEffect(() => {
        document.title = 'Page not found – WorkGroup'
    }, [])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content main_content--group-request">
                <center>
                    <AlertTriangle size={35} strokeWidth={2} />
                    <h1>An Error occured!</h1>
                    <span>The page you are looking for could not be found!</span>
                    <br />
                    <br />
                    <Link to="/app" primary component={Button}>
                        Your Feed
                    </Link>
                </center>
            </div>
        </div>
    )
}

export default Error404
