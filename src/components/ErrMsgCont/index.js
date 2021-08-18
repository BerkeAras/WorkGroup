import React from 'react'
import { Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const ErrorMsg = (props) => {
    return (
        <Message negative>
            <p>{props.errorMsg}</p>
        </Message>
    )
}

export default ErrorMsg

ErrorMsg.propTypes = {
    errorMsg: PropTypes.string,
}
