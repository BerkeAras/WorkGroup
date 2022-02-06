import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form, TextArea } from 'semantic-ui-react'
import W_Modal from '../../W_Modal'
import './style.scss'

function ReportPost(props) {
    const [reportTypeValue, setReportTypeValue] = useState('spam')
    const [reportTextValue, setReportTextValue] = useState('')
    const [reportIsLoading, setReportIsLoading] = useState(false)

    const handleTypeChange = (e, { value }) => {
        setReportTypeValue(value)
    }

    const handleReport = () => {
        setReportIsLoading(true)

        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                postId: props.postId,
                reportTypeValue: reportTypeValue,
                reportTextValue: reportTextValue,
            }),
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/content/reportPost', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error == false) {
                    setReportIsLoading(false)
                    props.handleSuccessMessage()
                    props.handleClose()
                } else {
                    setReportIsLoading(false)
                    props.handleErrorMessage()
                    props.handleClose()
                }
            })
    }

    return (
        <W_Modal
            onClose={props.handleClose}
            onOpen={props.handleOpen}
            open={props.open}
            size="tiny"
            className="report-post-modal"
            closeOnEscape={!reportIsLoading}
            closeOnDimmerClick={!reportIsLoading}
        >
            <Modal.Header>Report this post</Modal.Header>
            <Modal.Content>
                <h3>Why do you want to report this post?</h3>
                <Form>
                    <Form.Radio label="This post is spam." value="spam" checked={reportTypeValue === 'spam'} onChange={handleTypeChange} disabled={reportIsLoading} />
                    <Form.Radio
                        label="This post contains dangerous images, videos or files."
                        value="dangerous"
                        checked={reportTypeValue === 'dangerous'}
                        onChange={handleTypeChange}
                        disabled={reportIsLoading}
                    />
                    <Form.Radio
                        label="This post is about suicide, abuse or other dangers."
                        value="abuse"
                        checked={reportTypeValue === 'abuse'}
                        onChange={handleTypeChange}
                        disabled={reportIsLoading}
                    />
                    <Form.Radio label="It is something else." value="other" checked={reportTypeValue === 'other'} onChange={handleTypeChange} disabled={reportIsLoading} />
                    <h3>Please tell us what it is.</h3>
                    <TextArea
                        disabled={reportIsLoading}
                        value={reportTextValue}
                        onChange={(e) => {
                            setReportTextValue(e.target.value)
                        }}
                        placeholder="Please tell us what it is. (optional)"
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button disabled={reportIsLoading} onClick={props.handleClose} color="black">
                    Cancel
                </Button>
                <Button content="Report" labelPosition="right" icon="checkmark" positive loading={reportIsLoading} disabled={reportIsLoading} onClick={handleReport} />
            </Modal.Actions>
        </W_Modal>
    )
}

ReportPost.propTypes = {
    handleClose: PropTypes.any,
    handleOpen: PropTypes.any,
    open: PropTypes.any,
    postId: PropTypes.number,
    handleSuccessMessage: PropTypes.any,
    handleErrorMessage: PropTypes.any,
}

export default ReportPost
