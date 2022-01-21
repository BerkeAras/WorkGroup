import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams, useHistory } from 'react-router-dom'
import './style.scss'
import PropTypes from 'prop-types'
import { Modal, Button, Loader, List } from 'semantic-ui-react'
import { Zap } from 'react-feather';

function KnowledgeBaseFileHistory(props) {

    const { folderId, fileId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [fileHistoryItems, setFileHistoryItems] = useState([])
    const [showRestoreModal, setShowRestoreModal] = useState(false)
    const [restoreFileId, setRestoreFileId] = useState(null)

    useEffect(() => {

        setIsLoading(true);
        
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + window.localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        // Get Folders
        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFileHistory?file_id=' + fileId, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setFileHistoryItems(result.file_history)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error)
            })

    }, [fileId])

    const getDate = (date) => {
        let newDate = new Date(date)

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        let todaysDate = new Date()

        let dateString = ''

        if (newDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
            todaysDate = new Date()
            newDate = new Date(date)
            let currentHours = newDate.getHours()
            currentHours = ('0' + currentHours).slice(-2)

            dateString = 'Today, ' + currentHours + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()
        } else {
            dateString = newDate.toLocaleDateString(process.env.REACT_APP_LOCALE, options)
        }

        return dateString
    }

    const restoreFromHistory = () => {
        setIsLoading(true);

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + window.localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('file_history_id', restoreFileId)

        const requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData
        }

        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/restoreFromHistory', requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                location.reload();
            })
    }

    const previewHistory = () => {
        setShowRestoreModal(false);
        props.onClose()
        location.href = '/app/knowledgebase/' + folderId + '/' + fileId + '/' + restoreFileId;
    }

    return (
        <Modal open={true} className="KnowledgeBaseFileHistory" onClose={props.onClose} size="tiny">
            <Modal.Header>File History</Modal.Header>
            <Modal.Content>
                {isLoading ? (
                    <div className="loader">
                        <Loader active size="medium" content="Loading File History..." />
                    </div>
                ) : (
                    <>
                        {fileHistoryItems.length > 0 ? (
                            fileHistoryItems.map((fileHistoryItem, index) => {
                                return (
                                    <List
                                        key={index}
                                        divided
                                        relaxed
                                        onClick={() => {setShowRestoreModal(true);setRestoreFileId(fileHistoryItem.id)}}
                                    >
                                        <List.Item>
                                            <List.Content>
                                                <List.Header as="a">{getDate(fileHistoryItem.created_at)}</List.Header>
                                                <List.Description as="a">File overwritten by <b>{fileHistoryItem.user_name}</b>.</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                )
                            })
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>This File has no history.</span>
                            </center>
                        )}
                    
                    </>
                )}

                {showRestoreModal && (
                    <Modal onClose={() => {setShowRestoreModal(false);setRestoreFileId(null)}} onOpen={() => setShowRestoreModal(true)} open={showRestoreModal} size="mini">
                        <Modal.Header>Are you sure you want to restore this version?</Modal.Header>
                        <Modal.Content>The current version is archived and can be restored at any time.</Modal.Content>
                        <Modal.Actions>
                            <Button disabled={isLoading} loading={isLoading} onClick={() => {setShowRestoreModal(false);setRestoreFileId(null)}}>
                                Cancel
                            </Button>
                            <Button disabled={isLoading} loading={isLoading} onClick={previewHistory}>
                                Preview
                            </Button>
                            <Button primary disabled={isLoading} loading={isLoading} onClick={restoreFromHistory}>
                                Yes, restore
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )}

            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onClose}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default KnowledgeBaseFileHistory

KnowledgeBaseFileHistory.propTypes = {
    isLoading: PropTypes.bool,
    onClose: PropTypes.func,
}