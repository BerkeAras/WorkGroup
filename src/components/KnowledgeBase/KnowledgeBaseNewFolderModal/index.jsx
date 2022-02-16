import React, { useEffect, useState } from 'react'
import './style.scss'
import { Icon, Button, Message, Modal, Input, Form, Checkbox, List } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import W_Modal from '../../W_Modal'
import { ChevronRight, User, Users, Zap } from 'react-feather'

export default function KnowledgeBaseNewFolderModal(props) {
    const [folderName, setFolderName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [advancedMode, setAdvancedMode] = useState(false)
    const [advancedModeStep, setAdvancedModeStep] = useState(0)
    const [headerTitle, setHeaderTitle] = useState('Create a new Folder')
    const [permissions, setPermissions] = useState([])
    const [readCheckbox, setReadCheckbox] = useState(false)
    const [createCheckbox, setCreateCheckbox] = useState(false)
    const [modifyCheckbox, setModifyCheckbox] = useState(false)
    const [deleteCheckbox, setDeleteCheckbox] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('An error occured. Please try again later.')
    const [createdFolderId, setCreatedFolderId] = useState(null)
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [openedUser, setOpenedUser] = useState(null)
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserEmailError, setNewUserEmailError] = useState(false)
    const [newUserEmailErrorMessage, setNewUserEmailErrorMessage] = useState('')
    const [newGlobalUser, setNewGlobalUser] = useState(false)

    useEffect(() => {
        if (advancedModeStep == 1) {
            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let requestOptions = {
                method: 'GET',
                headers: tokenHeaders,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getPermissions?folder_id=' + createdFolderId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)
                    setPermissions(result.permissions)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [advancedModeStep])

    const createNewFolder = () => {
        if (folderName.length > 0) {
            setIsLoading(true)

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (props.folderId !== undefined) {
                folderDetailsId = props.folderId
            }

            const formData = new FormData()
            formData.append('folder_name', folderName)
            formData.append('folder_parent_id', folderDetailsId)
            formData.append('create_permission', !advancedMode)

            let requestOptions = {
                method: 'POST',
                headers: tokenHeaders,
                body: formData,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/createFolder', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)

                    if (!result.success) {
                        setShowError(true)
                        setErrorMessage(result.error)
                    } else {
                        if (!advancedMode) {
                            window.location.reload()
                        } else {
                            setCreatedFolderId(result.folder_id)
                            nextStep()
                        }
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const nextStep = () => {
        if (advancedModeStep == 0) {
            // Check if folder name is valid
            if (folderName.length > 0) {
                setHeaderTitle('"' + folderName + '" Permissions')
                setAdvancedModeStep(1)
            }
        } else if (advancedModeStep == 2) {
            storePermissions()
        }
    }

    const openUserPermissions = (user) => {
        setOpenedUser(user)
        setHeaderTitle('"' + (user.user != null ? user.user.name : 'Global') + '" Permissions')
        setAdvancedModeStep(2)
        setReadCheckbox(user.knowledge_base_permission_read === 1)
        setCreateCheckbox(user.knowledge_base_permission_write === 1)
        setModifyCheckbox(user.knowledge_base_permission_modify === 1)
        setDeleteCheckbox(user.knowledge_base_permission_delete == 1)

        if (user.user != null && user.user.is_admin == 1) {
            setUserIsAdmin(true)
        } else {
            setUserIsAdmin(false)
        }
    }

    const storePermissions = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', createdFolderId)
        formData.append('user_id', openedUser.user == null ? 0 : openedUser.user.id)
        formData.append('read_permission', readCheckbox)
        formData.append('create_permission', createCheckbox)
        formData.append('modify_permission', modifyCheckbox)
        formData.append('delete_permission', deleteCheckbox)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/modifyPermission', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)
                setAdvancedModeStep(1)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const removeUser = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', createdFolderId)
        formData.append('user_id', openedUser.user == null ? 0 : openedUser.user.id)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/removePermission', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)
                setAdvancedModeStep(1)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const createPermission = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', createdFolderId)
        formData.append('user_email', newGlobalUser ? '0' : newUserEmail)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/createPermission', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)

                if (result.error == false) {
                    setAdvancedModeStep(1)
                    setNewUserEmail('')
                    setNewGlobalUser(false)
                    setNewUserEmailError(false)
                } else {
                    setNewUserEmailError(true)
                    setNewUserEmailErrorMessage(result.message)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <W_Modal
            onClose={() => props.setShowNewFolderModal(false)}
            onOpen={() => props.setShowNewFolderModal(true)}
            className="KnowledgeBaseNewFolderModal"
            open={props.showNewFolderModal}
            size="mini"
        >
            <Modal.Header>{headerTitle}</Modal.Header>
            <Modal.Content>
                {showError ? (
                    <center>
                        <Zap size={35} strokeWidth={2} />
                        <br />
                        <span>{errorMessage}</span>
                    </center>
                ) : advancedModeStep == 0 ? (
                    <>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={folderName}
                                onChange={(e) => {
                                    setFolderName(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="Folder Name"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                checked={advancedMode}
                                onChange={() => {
                                    setAdvancedMode(!advancedMode)
                                }}
                                label="Advanced Mode"
                            />
                        </Form.Field>
                    </>
                ) : advancedModeStep == 1 ? (
                    <>
                        {permissions.length > 0 ? (
                            <List divided relaxed>
                                {permissions.map((user) => {
                                    return (
                                        <List.Item
                                            key={user.id}
                                            onClick={() => {
                                                openUserPermissions(user)
                                            }}
                                        >
                                            <List.Content>
                                                <div className="item-avatar">{!user.user ? <Users size={18} /> : <User size={18} />}</div>
                                                {!user.user ? 'Global' : user.user.name}
                                                <ChevronRight />
                                            </List.Content>
                                        </List.Item>
                                    )
                                })}
                            </List>
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>Start by adding a user to the folder</span>
                            </center>
                        )}
                    </>
                ) : advancedModeStep == 2 ? (
                    <>
                        {userIsAdmin && (
                            <>
                                <Message warning>
                                    <Message.Header>Warning!</Message.Header>
                                    <p>Administrators have full access to all Knowledge Base folders.</p>
                                </Message>
                                <br />
                            </>
                        )}
                        <Form.Field>
                            <Checkbox
                                disabled={userIsAdmin}
                                checked={readCheckbox}
                                onChange={() => {
                                    setReadCheckbox(!readCheckbox)
                                }}
                                label="Can read files and folders"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                disabled={userIsAdmin || !readCheckbox}
                                checked={!readCheckbox ? false : createCheckbox}
                                onChange={() => {
                                    setCreateCheckbox(!createCheckbox)
                                }}
                                label="Can create files and folders"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                disabled={userIsAdmin || !readCheckbox}
                                checked={!readCheckbox ? false : modifyCheckbox}
                                onChange={() => {
                                    setModifyCheckbox(!modifyCheckbox)
                                }}
                                label="Can edit files and folders"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                disabled={userIsAdmin || !readCheckbox}
                                checked={!readCheckbox ? false : deleteCheckbox}
                                onChange={() => {
                                    setDeleteCheckbox(!deleteCheckbox)
                                }}
                                label="Can delete files and folders or change permissions"
                            />
                        </Form.Field>
                    </>
                ) : advancedModeStep == 3 ? (
                    <>
                        {newUserEmailError && (
                            <>
                                <Message warning>
                                    <Message.Header>Warning!</Message.Header>
                                    <p>{newUserEmailErrorMessage}</p>
                                </Message>
                                <br />
                            </>
                        )}
                        <Form.Field>
                            <Input
                                disabled={isLoading || newGlobalUser}
                                value={newGlobalUser ? '' : newUserEmail}
                                onChange={(e) => {
                                    setNewUserEmail(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="User E-Mail"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                checked={newGlobalUser}
                                onChange={() => {
                                    setNewGlobalUser(!newGlobalUser)
                                }}
                                label="Or select all your collegues"
                            />
                        </Form.Field>
                    </>
                ) : (
                    <center>
                        <Zap size={35} strokeWidth={2} />
                        <br />
                        <span>An error occured. Please try again later.</span>
                    </center>
                )}
            </Modal.Content>
            <Modal.Actions>
                {advancedModeStep == 0 && (
                    <Button disabled={isLoading} color="black" onClick={() => props.setShowNewFolderModal(false)}>
                        Cancel
                    </Button>
                )}
                {advancedMode ? (
                    advancedModeStep == 1 ? (
                        <>
                            <Button disabled={isLoading} loading={isLoading} primary labelPosition="left" icon onClick={() => setAdvancedModeStep(3)}>
                                New User
                                <Icon name="add" />
                            </Button>
                            <Button disabled={isLoading} loading={isLoading} primary onClick={() => window.location.reload()}>
                                Done
                            </Button>
                        </>
                    ) : advancedModeStep == 2 ? (
                        <>
                            <Button disabled={isLoading} loading={isLoading} color="red" onClick={removeUser}>
                                Remove User
                            </Button>
                            <Button disabled={isLoading} loading={isLoading} primary onClick={storePermissions}>
                                Next
                            </Button>
                        </>
                    ) : advancedModeStep == 3 ? (
                        <>
                            <Button
                                disabled={isLoading}
                                loading={isLoading}
                                color="black"
                                onClick={() => {
                                    setAdvancedModeStep(1)
                                    setNewUserEmail('')
                                    setNewGlobalUser(false)
                                    setNewUserEmailError(false)
                                }}
                            >
                                Back
                            </Button>
                            <Button disabled={isLoading} loading={isLoading} primary onClick={createPermission}>
                                Next
                            </Button>
                        </>
                    ) : (
                        <Button disabled={isLoading} loading={isLoading} primary onClick={createNewFolder}>
                            Next
                        </Button>
                    )
                ) : (
                    <Button disabled={isLoading} loading={isLoading} primary onClick={createNewFolder}>
                        Create
                    </Button>
                )}
            </Modal.Actions>
        </W_Modal>
    )
}

KnowledgeBaseNewFolderModal.propTypes = {
    setShowNewFolderModal: PropTypes.func.isRequired,
    showNewFolderModal: PropTypes.bool.isRequired,
    folderId: PropTypes.any,
}
