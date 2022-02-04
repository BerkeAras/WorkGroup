import React, { useEffect } from 'react'
import './style.scss'
import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

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

    const handleDropdownBlur = (e) => {
        const currentTarget = e.currentTarget

        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                const container = document.querySelector('.header__dropdown')
                container.style.display = 'none'
                props.setDropDownVisible(false)
            }
        }, 0)
    }

    return (
        <div onBlur={(e) => {handleDropdownBlur(e)}} className="header__dropdown">
            <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to={'/app/user/' + localStorage.getItem('user_email')}>
                My Account
            </NavLink>
            {localStorage.getItem('user_admin') !== undefined && localStorage.getItem('user_admin') == '1' && (
                <NavLink exact className="header__dropdown-item" activeClassName="header__dropdown-item--active" to="/app/settings">
                    Manage WorkGroup
                </NavLink>
            )}
            <a className="header__dropdown-item" href="https://github.com/BerkeAras/WorkGroup#contact" target="_blank" rel="noreferrer">
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
