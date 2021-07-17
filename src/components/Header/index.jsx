import React from 'react'
import './style.scss'
import logo from '../../static/logo.svg'
import { Link, NavLink } from 'react-router-dom'

// Icons
import { MoreVertical, Menu, X } from 'react-feather'

// Components
import HeaderDropdown from '../HeaderDropdown'
import SearchField from '../_Header_Searchfield'

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

    showHeaderDropdown = (e) => {
        e.preventDefault()
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

    handleDropdownBlur = (e) => {
        console.log('handleDropdownBlur')

        const currentTarget = e.currentTarget

        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                this.setState({
                    dropdownVisible: false,
                })
            }
        }, 0)
    }

    render() {
        return (
            <div className="nav-header">
                <NavLink exact to="/" className="header__logo">
                    <img src={logo} alt="Logo" />
                </NavLink>

                <SearchField />

                <a href="#" onClick={this.showHeaderDropdown} className="header__dropdown-button">
                    <MoreVertical></MoreVertical>
                </a>

                <a href="#" onClick={this.showMobileMenu} className="header__menu-mobile-button">
                    <Menu></Menu>
                </a>

                <div className={`header__menu-items ${this.state.mobileMenuVisible ? 'header__menu-items--mobile-visible' : ''}`}>
                    <div onClick={this.hideMobileMenu} className="header__menu-mobile-close">
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

                {this.state.dropdownVisible && <HeaderDropdown onBlurHandler={this.had}></HeaderDropdown>}
            </div>
        )
    }
}

export default Header
