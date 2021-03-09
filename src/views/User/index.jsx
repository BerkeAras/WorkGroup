/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Input } from 'semantic-ui-react'
import logo from '../../static/logo.svg'
import PropTypes from 'prop-types'

// Components
import Header from '../../components/Header'
import Content from '../../components/Content'

import UserBanner from '../../components/_User_UserBanner';

function User() {

    let { email } = useParams();

    useEffect(() => {
        document.title = 'User – WorkGroup';
    })

    return (
        <div className="app">
            <Header />
            <div className="main_content">
                <UserBanner email={email}></UserBanner>
            </div>
        </div>
    );

}

export default User;