import React from 'react'
import './style.scss'
import PropTypes from 'prop-types'

const Content = (props) => {
    return <div className="content_container">{props.children}</div>
}

Content.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Content
