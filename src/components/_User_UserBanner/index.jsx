import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Icon, Button, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import unknownBanner from '../../static/banner.jpg'
import unknownAvatar from '../../static/unknown.png'

function UserBanner(props) {
    const [background, setBackground] = useState(unknownBanner)
    const [avatar, setAvatar] = useState(unknownAvatar)
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('')
    const [isLoadingUser, setIsLoadingUser] = useState(true)

    useEffect(() => {
        let userInformation = props.userInformation

        setIsLoadingUser(true)

        var userHeader = new Headers()
        userHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        var requestOptions = {
            method: 'GET',
            headers: userHeader,
            redirect: 'follow',
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/auth/user', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setLoggedInUserEmail(result.data.email)
                setIsLoadingUser(false)
            })
            .catch((error) => console.log('error', error))

        if (userInformation['banner'] != '' && userInformation['banner'] != undefined) {
            setBackground(process.env.REACT_APP_API_URL + '/' + userInformation['banner'].replace('./', ''))
        }
        if (userInformation['avatar'] != '' && userInformation['avatar'] != undefined) {
            setAvatar(process.env.REACT_APP_API_URL + '/' + userInformation['avatar'].replace('./', ''))
        }
    }, [props.userInformation])

    return (
        <div className="user-banner">
            <img
                onError={(e) => {
                    e.target.src = unknownBanner
                }}
                src={background}
                alt="Banner"
                className="banner-image"
            />

            <img
                onError={(e) => {
                    e.target.src = unknownAvatar
                }}
                src={avatar}
                alt="Avatar"
                className="user-avatar"
            />
            <br />

            {isLoadingUser === true ? (
                <div className="banner-content banner-content-loading">
                    <Loader active>Loading profile...</Loader>
                </div>
            ) : (
                <div className="banner-content">
                    {loggedInUserEmail == props.userInformation['email'] && (
                        <Button
                            size="tiny"
                            basic
                            onClick={() => {
                                localStorage.setItem('first_login', 'true')
                                location.reload()
                            }}
                            primary
                            icon
                            labelPosition="left"
                        >
                            <Icon name="pencil" />
                            Edit your Account
                        </Button>
                    )}

                    <span className="user-name">{props.userInformation['name']}</span>
                </div>
            )}
        </div>
    )
}

export default UserBanner
UserBanner.propTypes = {
    userInformation: PropTypes.any,
}
