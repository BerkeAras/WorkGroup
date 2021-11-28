import React, { useEffect } from 'react'
import './style.scss'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
// Icons
import { MoreVertical } from 'react-feather'
import logo from '../../static/logo.svg'

const HeaderDropdown = (props) => {
    useEffect(() => {
        document.addEventListener('mouseup', (e) => {
            if (document.querySelector('.header__dropdown')) {
                const container = document.querySelector('.header__dropdown')
                if (!container.contains(e.target)) {
                    container.style.display = 'none'
                    props.setDropDownVisible(false)
                }
            }
        })
    }, [])

    return (
        <div className="header__dropdown">
            <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/app/settings">
                App Settings
            </NavLink>
            <a exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" href="https://github.com/BerkeAras/WorkGroup#contact" target="_blank" rel="noreferrer">
                Get help
            </a>
            <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/logout">
                Log out
            </NavLink>
        </div>
    )
}

HeaderDropdown.propTypes = {
    setDropDownVisible: PropTypes.func,
}

export default HeaderDropdown
