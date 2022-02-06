import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Icon, Button, Loader, Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { MoreVertical } from 'react-feather'
import ChangePassword from '../UserChangePassword'

import unknownBanner from '../../../static/banner.jpg'
import unknownAvatar from '../../../static/unknown.png'

function UserBanner(props) {
    const [background, setBackground] = useState(unknownBanner)
    const [avatar, setAvatar] = useState(unknownAvatar)
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('')
    const [isLoadingUser, setIsLoadingUser] = useState(true)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)

    useEffect(() => {
        let userInformation = props.userInformation

        setIsLoadingUser(true)

        let userHeader = new Headers()
        userHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        let requestOptions = {
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

        if (userInformation['banner'] != '' && userInformation['banner'] != undefined) {
            setBackground(process.env.REACT_APP_API_URL + '/' + userInformation['banner'].replace('./', ''))
        }
        if (userInformation['avatar'] != '' && userInformation['avatar'] != undefined) {
            setAvatar(process.env.REACT_APP_API_URL + '/' + userInformation['avatar'].replace('./', ''))
        }
    }, [props.userInformation])

    const handleDropdownBlur = (e) => {
        const currentTarget = e.currentTarget

        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                setShowUserDropdown(false)
            }
        }, 0)
    }

    const handleDropdownClick = (e) => {
        e.preventDefault()
        setShowUserDropdown(!showUserDropdown)
    }

    return (
        <>
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
                        <div className="banner-content-dropdown" onBlur={handleDropdownBlur}>
                            <a href="#" onClick={handleDropdownClick} className="banner-content-dropdown-button">
                                <MoreVertical size={24}></MoreVertical>
                            </a>
                            {showUserDropdown && (
                                <div className="banner-content-dropdown-container">
                                    {loggedInUserEmail == props.userInformation['email'] ? (
                                        <>
                                            <a
                                                onClick={() => {
                                                    localStorage.setItem('first_login', 'true')
                                                    location.reload()
                                                }}
                                                href="#"
                                            >
                                                Edit your Account
                                            </a>
                                            <a
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setShowUserDropdown(false)
                                                    setShowPasswordResetModal(true)
                                                }}
                                                href="#"
                                            >
                                                Change your password
                                            </a>
                                        </>
                                    ) : (
                                        <a target="_blank" rel="noreferrer" href={'mailto:' + props.userInformation['email'] + '?subject=Hello!&body=%0D%0A%0D%0AFound%20you%20on%20WorkGroup.'}>
                                            Send an E-Mail
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <span className="user-name">
                            <div className={`user-online-status ${props.userInformation['user_online'] == 1 && 'user-online-status--online'}`}></div> {props.userInformation['name']}
                        </span>
                    </div>
                )}
            </div>
            {showPasswordResetModal && <ChangePassword isOpenState={showPasswordResetModal} isOpenStateController={setShowPasswordResetModal} />}
        </>
    )
}

export default UserBanner
UserBanner.propTypes = {
    userInformation: PropTypes.any,
}
