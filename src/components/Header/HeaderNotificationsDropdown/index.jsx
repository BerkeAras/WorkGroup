import React, { useEffect, useState } from 'react'
import './style.scss'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import unknownAvatar from '../../../static/unknown.png'

const HeaderNotificationsDropdown = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        document.addEventListener('mouseup', (e) => {
            if (document.querySelector('.header__notifications__dropdown')) {
                const container = document.querySelector('.header__notifications__dropdown')
                if (!container.contains(e.target)) {
                    container.style.display = 'none'
                    props.setDropDownVisible(false)
                }
            }
        })

        let userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/notifications/getInAppNotifications?select=30&setread`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                setIsLoading(false)
                setNotifications(res)
            })
    }, [])

    const handleDropdownBlur = (e) => {
        const currentTarget = e.currentTarget

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                const container = document.querySelector('.header__notifications__dropdown')
                container.style.display = 'none'
                props.setDropDownVisible(false)
            }
        }, 0)
    }

    return (
        <div
            onBlur={(e) => {
                handleDropdownBlur(e)
            }}
            className="header__notifications__dropdown"
        >
            {isLoading ? (
                <div style={{ padding: '50px 0' }}>
                    <Loader active size="medium" content="" />
                </div>
            ) : notifications.length == 0 ? (
                <span className="empty-notifications">You have no unread notifications.</span>
            ) : (
                notifications.map((notification, index) => {
                    return (
                        <Link key={index} to={notification.notification_link}>
                            <div className={`notification-item ${notification.notification_read == 1 && `notification-item--read`}`}>
                                <div className="notification-avatar">
                                    <img
                                        src={process.env.REACT_APP_API_URL + '/' + notification.user.avatar.replace('./', '')}
                                        onError={(e) => {
                                            e.target.src = unknownAvatar
                                        }}
                                    />
                                    {notification.user.user_online == 1 && <div className="online-indicator"></div>}
                                </div>
                                <div className="notification-content">
                                    <b>{notification.notification_subject}</b>
                                    <p>{notification.notification_content}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })
            )}
        </div>
    )
}

HeaderNotificationsDropdown.propTypes = {
    setDropDownVisible: PropTypes.func,
}

export default HeaderNotificationsDropdown
