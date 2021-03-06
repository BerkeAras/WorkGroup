import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Icon, Button, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { User, Mail, Briefcase, MapPin, Globe } from 'react-feather'

import unknownBanner from '../../static/banner.jpg'
import unknownAvatar from '../../static/unknown.png'

function UserBanner(props) {
    const [background, setBackground] = useState(unknownBanner)
    const [avatar, setAvatar] = useState(unknownAvatar)
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let userInformation = props.userInformation

        setIsLoading(true)

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
                setIsLoading(false)
            })
            .catch((error) => console.log('error', error))

        if (userInformation['banner'] != '' && userInformation['banner'] != undefined) {
            setBackground(process.env.REACT_APP_API_URL + '/' + userInformation['banner'].replace('./', ''))
        }
        if (userInformation['avatar'] != '' && userInformation['avatar'] != undefined) {
            setAvatar(process.env.REACT_APP_API_URL + '/' + userInformation['avatar'].replace('./', ''))
        }
    }, [props])

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

            {isLoading === true ? (
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
                    <br />
                    <div className="user-details-grid">
                        {props.userInformation['user_slogan'] !== '' && props.userInformation['user_slogan'] !== null && props.userInformation['user_slogan'] !== undefined && (
                            <span className="user-slogan">
                                <User size={20} strokeWidth={2.5} /> {props.userInformation['user_slogan']}
                            </span>
                        )}
                        <span className="user-email">
                            <Mail size={20} strokeWidth={2.5} /> {props.userInformation['email']}
                        </span>
                        {props.userInformation['user_department'] !== '' && props.userInformation['user_department'] !== null && props.userInformation['user_department'] !== undefined && (
                            <span className="user-department">
                                <Briefcase size={20} strokeWidth={2.5} /> {props.userInformation['user_department']}
                            </span>
                        )}
                        {props.userInformation['user_street'] !== '' && props.userInformation['user_street'] !== null && props.userInformation['user_street'] !== undefined && (
                            <span className="user-street">
                                <MapPin size={20} strokeWidth={2.5} /> {props.userInformation['user_street']}
                            </span>
                        )}
                        {props.userInformation['user_city'] !== '' && props.userInformation['user_city'] !== null && props.userInformation['user_city'] !== undefined && (
                            <span className="user-city">
                                <Globe size={20} strokeWidth={2.5} /> {props.userInformation['user_city']}, {props.userInformation['user_country']}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserBanner
UserBanner.propTypes = {
    userInformation: PropTypes.any,
}
