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

import UserBanner from '../../components/_User_UserBanner'

function User() {
    let { email } = useParams()
    const [userInformation, setUserInformation] = useState([])

    useEffect(() => {
        document.title = 'Loading user... – WorkGroup'

        var userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        var requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }
        fetch(process.env.REACT_APP_API_URL + `/api/user/getUserInformation?email=${email}`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.length > 0) {
                    setUserInformation(res[0])
                    document.title = res[0]['name'] + ' – WorkGroup'
                }
            })
    }, [])

    return (
        <div className="app">
            <Header />
            <div className="main_content">
                <UserBanner userInformation={userInformation}></UserBanner>
            </div>
        </div>
    )
}

export default User
