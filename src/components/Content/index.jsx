import React from 'react'
import './style.scss'
import PropTypes from 'prop-types'

class SidebarRight extends React.Component {
    componentDidMount() {}

    render() {
        return <div className="content_container">{this.props.children}</div>
    }
}

SidebarRight.propTypes = {
    children: PropTypes.node.isRequired,
}

export default SidebarRight
