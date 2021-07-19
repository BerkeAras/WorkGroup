import React, { useState } from 'react'
import './style.scss'
import logo from '../../static/logo.svg'
import { Link, NavLink } from 'react-router-dom'

// Icons
import { MoreVertical, Menu, X } from 'react-feather'

// Components
import HeaderDropdown from '../HeaderDropdown'
import SearchField from '../_Header_Searchfield'

const Header = () => {
    const [dropdownVisible, setDropDownVisible] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const showHeaderDropdown = e => {
        e.preventDefault();
        setDropDownVisible(!dropdownVisible);
    }

    const showMobileMenu = () => {
        setMobileMenuVisible(true);
    }
    
    const hideMobileMenu = () => {
        setMobileMenuVisible(false);
    }

    const handleDropdownBlur = (e) => {
        console.log('handleDropdownBlur')

        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!e.currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                setDropDownVisible(false);
            }
        }, 0);
    }

    return (
        <div className="nav-header">
            <NavLink exact to="/" className="header__logo">
                <img src={logo} alt="Logo" />
            </NavLink>
            <SearchField />
            <a href="#" onClick={e => showHeaderDropdown(e)} className="header__dropdown-button">
                <MoreVertical></MoreVertical>
            </a>
            <a href="#" onClick={showMobileMenu} className="header__menu-mobile-button">
                <Menu></Menu>
            </a>

            <div className={`header__menu-items ${mobileMenuVisible ? 'header__menu-items--mobile-visible' : ''}`}>
                <div onClick={hideMobileMenu} className="header__menu-mobile-close">
                    <X></X>
                </div>

                <NavLink exact className="header__menu-item" activeClassName="header__menu-item--active" to="/app">
                    Home
                </NavLink>
                <NavLink exact className="header__menu-item" activeClassName="header__menu-item--active" to="/app/today">
                    Today
                </NavLink>
                <NavLink exact className="header__menu-item" activeClassName="header__menu-item--active" to="/app/groups">
                    Groups
                </NavLink>
            </div>

            {
                dropdownVisible ? <HeaderDropdown setDropDownVisible={setDropDownVisible} onBlurHandler={e => handleDropdownBlur(e)}></HeaderDropdown> : null
            }
        </div>
    )
}

export default Header
