import React, { useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import FocusTrap from 'focus-trap-react'

export default function W_Modal(props) {
    return (
        <FocusTrap active={props.open}>
            <Modal {...props}>{props.children}</Modal>
        </FocusTrap>
    )
}

W_Modal.propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.any,
}
