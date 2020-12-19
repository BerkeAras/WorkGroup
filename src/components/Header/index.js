import React from 'react'
import './style.scss'
import logo from '../../static/logo.svg'
import { Link, NavLink } from 'react-router-dom'

// Icons
import { MoreVertical, Menu, X } from 'react-feather'

// Components
import HeaderDropdown from '../HeaderDropdown'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dropdownVisible: false,
            mobileMenuVisible: false,
        }
        this.showHeaderDropdown = this.showHeaderDropdown.bind(this)
        this.showMobileMenu = this.showMobileMenu.bind(this)
        this.hideMobileMenu = this.hideMobileMenu.bind(this)
    }

    showHeaderDropdown = () => {
        this.setState({
            dropdownVisible: !this.state.dropdownVisible,
        })
    }
    showMobileMenu = () => {
        this.setState({
            mobileMenuVisible: !this.state.mobileMenuVisible,
        })
    }
    hideMobileMenu = () => {
        this.setState({
            mobileMenuVisible: false,
        })
    }
    render() {
        return (
            <div className="header">
                <NavLink exact to="/">
                    <img src={logo} alt="Logo" className="header__logo" />
                </NavLink>

                <div
                    onClick={this.showHeaderDropdown}
                    className="header__dropdown-button"
                >
                    <MoreVertical></MoreVertical>
                </div>

                <div
                    onClick={this.showMobileMenu}
                    className="header__menu-mobile-button"
                >
                    <Menu></Menu>
                </div>

                <div
                    className={`header__menu-items ${
                        this.state.mobileMenuVisible
                            ? 'header__menu-items--mobile-visible'
                            : ''
                    }`}
                >
                    <div
                        onClick={this.hideMobileMenu}
                        className="header__menu-mobile-close"
                    >
                        <X></X>
                    </div>

                    <NavLink
                        exact
                        className="header__menu-item"
                        activeClassName="header__menu-item--active"
                        to="/app"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        exact
                        className="header__menu-item"
                        activeClassName="header__menu-item--active"
                        to="/app/today"
                    >
                        Today
                    </NavLink>
                    <NavLink
                        exact
                        className="header__menu-item"
                        activeClassName="header__menu-item--active"
                        to="/app/groups"
                    >
                        Groups
                    </NavLink>
                </div>

                {this.state.dropdownVisible && (
                    <HeaderDropdown></HeaderDropdown>
                )}
            </div>
        )
    }
}

export default Header
