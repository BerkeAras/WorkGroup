import React from 'react'
import './style.scss'
import PropTypes from 'prop-types'

const SidebarRight = (props) => {
    return <div className="content_container">{props.children}</div>
}

SidebarRight.propTypes = {
    children: PropTypes.node.isRequired,
}

export default SidebarRight
