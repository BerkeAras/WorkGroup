/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { User as UserIcon, Mail, Briefcase, MapPin, Globe } from 'react-feather'

// Components
import Header from '../../components/Header/Header'
import PostsList from '../../components/Feed/FeedPostsList'

import UserBanner from '../../components/User/UserBanner'

function User() {
    let { email } = useParams()
    const [userInformation, setUserInformation] = useState([])

    useEffect(() => {
        document.title = 'Loading user... – WorkGroup'

        let userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        let requestOptions = {
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
    }, [email])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content">
                <UserBanner userInformation={userInformation}></UserBanner>
                <div className="user-account-content">
                    <div className="user-account-information">
                        {userInformation['user_slogan'] !== '' && userInformation['user_slogan'] !== null && userInformation['user_slogan'] !== undefined && (
                            <span className="user-account-information-item user-slogan">
                                <UserIcon size={20} strokeWidth={2.5} /> {userInformation['user_slogan']}
                            </span>
                        )}
                        <span className="user-account-information-item user-email">
                            <Mail size={20} strokeWidth={2.5} /> {email}
                        </span>
                        {userInformation['user_department'] !== '' && userInformation['user_department'] !== null && userInformation['user_department'] !== undefined && (
                            <span className="user-account-information-item user-department">
                                <Briefcase size={20} strokeWidth={2.5} /> {userInformation['user_department']}
                            </span>
                        )}
                        {userInformation['user_street'] !== '' && userInformation['user_street'] !== null && userInformation['user_street'] !== undefined && (
                            <span className="user-account-information-item user-street">
                                <MapPin size={20} strokeWidth={2.5} /> {userInformation['user_street']}
                            </span>
                        )}
                        {userInformation['user_city'] !== '' && userInformation['user_city'] !== null && userInformation['user_city'] !== undefined && (
                            <span className="user-account-information-item user-city">
                                <Globe size={20} strokeWidth={2.5} /> {userInformation['user_city']}, {userInformation['user_country']}
                            </span>
                        )}
                    </div>
                    <div className="user-account-feed">
                        <PostsList user={email} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
