import React from 'react'
import './style.scss'
import { Link, NavLink } from 'react-router-dom'

// Icons
import { MoreVertical } from 'react-feather'
import logo from '../../static/logo.svg'

class HeaderDropdown extends React.Component {
    componentDidMount() {
        document.addEventListener('mouseup', (e) => {
            if (document.querySelector('.header__dropdown')) {
                const container = document.querySelector('.header__dropdown')
                if (!container.contains(e.target)) {
                    container.style.display = 'none'
                }
            }
        })
    }

    render() {
        return (
            <div className="header__dropdown">
                <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/app">
                    My Account
                </NavLink>
                <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/app/today">
                    App Settings
                </NavLink>
                <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/app/groups">
                    Get help
                </NavLink>
                <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/logout">
                    Log out
                </NavLink>
            </div>
        )
    }
}

export default HeaderDropdown
