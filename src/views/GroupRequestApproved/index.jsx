/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button } from 'semantic-ui-react'
import { Zap } from 'react-feather'
import unknownAvatar from '../../static/unknown.png'
import unknownBanner from '../../static/banner.jpg'

// Components
import Header from '../../components/Header/Header'

function GroupRequestApproved() {
    useEffect(() => {
        document.title = 'Your Group Request – WorkGroup'
    }, [])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content main_content--group-request">
                <center>
                    <Zap size={35} strokeWidth={2} />
                    <h1>You have successfully joined a group.</h1>
                    <span>Start talking and exchanging ideas with your colleagues!</span>
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

export default GroupRequestApproved
