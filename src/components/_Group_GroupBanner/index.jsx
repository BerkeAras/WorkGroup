import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Icon, Button, Loader, Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { MoreVertical } from 'react-feather'

import unknownBanner from '../../static/banner.jpg'
import unknownAvatar from '../../static/unknown.png'

function GroupBanner(props) {
    const [background, setBackground] = useState(unknownBanner)
    const [avatar, setAvatar] = useState(unknownAvatar)
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('')
    const [isLoadingGroup, setIsLoadingGroup] = useState(true)
    const [showUserDropdown, setShowUserDropdown] = useState(false)

    useEffect(() => {
        let groupInformation = props.groupInformation

        if (groupInformation.group_title !== undefined) {
            setIsLoadingGroup(false);
        }

        if (groupInformation['banner'] != '' && groupInformation['banner'] != undefined) {
            setBackground(process.env.REACT_APP_API_URL + '/' + groupInformation['banner'].replace('./', ''))
        }
        if (groupInformation['avatar'] != '' && groupInformation['avatar'] != undefined) {
            setAvatar(process.env.REACT_APP_API_URL + '/' + groupInformation['avatar'].replace('./', ''))
        }
    }, [props.groupInformation])

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
        <div className="group-banner">
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

            {isLoadingGroup === true ? (
                <div className="banner-content banner-content-loading">
                    <Loader active>Loading group...</Loader>
                </div>
            ) : (
                <div className="banner-content">
                    <div className="banner-content-dropdown" onBlur={handleDropdownBlur}>
                        <a href="#" onClick={handleDropdownClick} className="banner-content-dropdown-button">
                            <MoreVertical size={24}></MoreVertical>
                        </a>
                        {showUserDropdown && (
                            <div className="banner-content-dropdown-container">
                                {loggedInUserEmail == props.groupInformation['email'] ? (
                                    <a
                                        onClick={() => {
                                            localStorage.setItem('first_login', 'true')
                                            location.reload()
                                        }}
                                        href="#"
                                    >
                                        Edit your Account
                                    </a>
                                ) : (
                                    <a target="_blank" rel="noreferrer" href={'mailto:' + props.groupInformation['email'] + '?subject=Hello!&body=%0D%0A%0D%0AFound%20you%20on%20WorkGroup.'}>
                                        Send an E-Mail
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <span className="user-name">
                        {props.groupInformation['group_title']}
                    </span>
                </div>
            )}
        </div>
    )
}

export default GroupBanner
GroupBanner.propTypes = {
    groupInformation: PropTypes.any,
}
