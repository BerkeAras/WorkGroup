import React, { useState, useEffect, useContext } from 'react'
import './style.scss'
import logo from '../../../static/logo.svg'
import { Link, NavLink } from 'react-router-dom'
import ConfigContext from '../../../store/ConfigContext'

// Icons
import { MoreVertical, Menu, X, Bell } from 'react-feather'

// Components
import HeaderDropdown from '../HeaderDropdown'
import HeaderNotificationsDropdown from '../HeaderNotificationsDropdown'
import SearchField from '../HeaderSearchField'

const Header = () => {
    const contextValue = useContext(ConfigContext)
    const [dropdownVisible, setDropDownVisible] = useState(false)
    const [notificationsDropdownVisible, setNotificationsDropdownVisible] = useState(false)
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
    const [headerLogo, setHeaderLogo] = useState(logo)

    const showHeaderDropdown = (e) => {
        e.preventDefault()
        setNotificationsDropdownVisible(false)
        setDropDownVisible(!dropdownVisible)
    }

    const showNotificationsDropdown = (e) => {
        e.preventDefault()
        setDropDownVisible(false)
        setHasUnreadNotifications(false)
        setNotificationsDropdownVisible(!notificationsDropdownVisible)
    }

    const showMobileMenu = () => {
        setMobileMenuVisible(true)
    }

    const hideMobileMenu = () => {
        setMobileMenuVisible(false)
    }

    const handleDropdownBlur = (e) => {
        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!e.currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                setDropDownVisible(false)
                setNotificationsDropdownVisible(false)
            }
        }, 0)
    }

    useEffect(() => {
        if (contextValue != undefined) {
            setHeaderLogo(process.env.REACT_APP_API_URL + '/static/' + contextValue.app.logo)
        }

        notificationListener()

        // Run notificationListener every minute
        const interval = setInterval(() => {
            notificationListener()
        }, 60000)

        return () => clearInterval(interval)
    }, [contextValue])

    const notificationListener = () => {
        // Check unread notifications
        let userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/notifications/checkUnreadNotifications`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res > 0) {
                    document.getElementById('favicon').href = '/assets/favicon-new-message.ico'
                    setHasUnreadNotifications(true)
                } else {
                    document.getElementById('favicon').href = '/assets/favicon.ico'
                    setHasUnreadNotifications(false)
                }
            })
    }

    return (
        <>
            <a tabIndex="1" href="#main_content" className="skip-to-content">
                Skip to content
            </a>
            <div className="nav-header">
                <NavLink to="/" className="header__logo">
                    <img src={headerLogo} alt="Logo" />
                </NavLink>
                <SearchField />
                <a href="#" onClick={(e) => showHeaderDropdown(e)} className="header__dropdown-button">
                    <MoreVertical></MoreVertical>
                </a>
                <a href="#a" onClick={(e) => showNotificationsDropdown(e)} className="header__dropdown-button">
                    <Bell></Bell>
                    {hasUnreadNotifications && <span className="header__dropdown-button-notification-indicator"></span>}
                </a>
                <a href="#" onClick={showMobileMenu} className="header__menu-mobile-button">
                    <Menu></Menu>
                </a>

                <div className={`header__menu-items ${mobileMenuVisible ? 'header__menu-items--mobile-visible' : ''}`}>
                    <div onClick={hideMobileMenu} className="header__menu-mobile-close">
                        <X></X>
                    </div>

                    <NavLink end className={({ isActive }) => (!isActive ? 'header__menu-item' : 'header__menu-item header__menu-item--active')} to="/app">
                        Home
                    </NavLink>
                    <NavLink end className={({ isActive }) => (!isActive ? 'header__menu-item' : 'header__menu-item header__menu-item--active')} to="/app/groups">
                        Groups
                    </NavLink>
                    <NavLink className={({ isActive }) => (!isActive ? 'header__menu-item' : 'header__menu-item header__menu-item--active')} to="/app/knowledgebase">
                        Knowledge Base
                    </NavLink>
                </div>

                {dropdownVisible ? <HeaderDropdown setDropDownVisible={setDropDownVisible} onBlurHandler={(e) => handleDropdownBlur(e)}></HeaderDropdown> : null}
                {notificationsDropdownVisible ? (
                    <HeaderNotificationsDropdown setDropDownVisible={setNotificationsDropdownVisible} onBlurHandler={(e) => handleDropdownBlur(e)}></HeaderNotificationsDropdown>
                ) : null}
            </div>
        </>
    )
}

export default Header
