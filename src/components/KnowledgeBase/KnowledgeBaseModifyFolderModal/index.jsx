import React, { useEffect, useState } from 'react'
import './style.scss'
import { Icon, Button, Message, Modal, Input, Form, Checkbox, Loader, List } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import W_Modal from '../../W_Modal'
import { Trash2, Lock, Zap, User, Users, ChevronRight } from 'react-feather'

export default function KnowledgeBaseModifyFolderModal(props) {
    const [folderName, setFolderName] = useState(props.modifyFolderName)
    const [folderDescription, setFolderDescription] = useState(props.modifyFolderDescription)
    const [isLoading, setIsLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [permissionsStep, setPermissionsStep] = useState(0)
    const [permissions, setPermissions] = useState([])
    const [openedUser, setOpenedUser] = useState(null)
    const [readCheckbox, setReadCheckbox] = useState(false)
    const [createCheckbox, setCreateCheckbox] = useState(false)
    const [modifyCheckbox, setModifyCheckbox] = useState(false)
    const [deleteCheckbox, setDeleteCheckbox] = useState(false)
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserEmailError, setNewUserEmailError] = useState(false)
    const [newUserEmailErrorMessage, setNewUserEmailErrorMessage] = useState('')
    const [newGlobalUser, setNewGlobalUser] = useState(false)

    useEffect(() => {
        if (permissionsStep == 1) {
            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let requestOptions = {
                method: 'GET',
                headers: tokenHeaders,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getPermissions?folder_id=' + props.folderId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)
                    setPermissions(result.permissions)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [permissionsStep])

    const modifyFolder = () => {
        if (folderName.length > 0 && props.folderPermissions['modify']) {
            setIsLoading(true)

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (props.folderId !== undefined) {
                folderDetailsId = props.folderId
            }

            const formData = new FormData()
            formData.append('folder_name', folderName)
            formData.append('folder_description', folderDescription)
            formData.append('folder_id', folderDetailsId)

            let requestOptions = {
                method: 'POST',
                headers: tokenHeaders,
                body: formData,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/modifyFolder', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)

                    if (!result.success) {
                        setShowError(true)
                        setErrorMessage(result.error)
                    } else {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const openUserPermissions = (user) => {
        setOpenedUser(user)
        setPermissionsStep(2)
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

    const removeUser = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', props.folderId)
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
                setPermissionsStep(1)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const storePermissions = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', props.folderId)
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
                setPermissionsStep(1)
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
        formData.append('folder_id', props.folderId)
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
                    setPermissionsStep(1)
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
            className="KnowledgeBaseModifyFolderModal"
            onClose={() => props.setShowModifyFolderModal(false)}
            onOpen={() => props.setShowModifyFolderModal(true)}
            open={props.showModifyFolderModal}
            size="mini"
        >
            <Modal.Header>Modify this Folder</Modal.Header>
            <Modal.Content>
                {showError ? (
                    <center>
                        <Zap size={35} strokeWidth={2} />
                        <br />
                        <span>{errorMessage}</span>
                    </center>
                ) : (
                    <>
                        {permissionsStep === 0 ? (
                            <>
                                <Form.Field>
                                    <Input
                                        disabled={isLoading || !props.folderPermissions['modify']}
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
                                    <Input
                                        disabled={isLoading || !props.folderPermissions['modify']}
                                        value={folderDescription}
                                        onChange={(e) => {
                                            setFolderDescription(e.target.value)
                                        }}
                                        fluid
                                        size="small"
                                        placeholder="Folder Description"
                                    />
                                </Form.Field>

                                {props.folderPermissions['delete'] == true && (
                                    <center>
                                        <a
                                            className="permissions-link"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setIsLoading(true)
                                                setPermissionsStep(1)
                                            }}
                                        >
                                            <Lock size={16} /> Configurate the permissions
                                        </a>
                                    </center>
                                )}

                                {props.folderPermissions['delete'] == true && (
                                    <center>
                                        <a href="#" onClick={props.openDeleteFolderModal}>
                                            <Trash2 size={16} /> Delete this Folder
                                        </a>
                                    </center>
                                )}
                            </>
                        ) : permissionsStep == 1 ? (
                            <>
                                {isLoading ? (
                                    <div className="KnowledgeBaseModifyFolderModal-loader">
                                        <Loader size="medium" active>
                                            Loading...
                                        </Loader>
                                    </div>
                                ) : permissions.length > 0 ? (
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
                        ) : permissionsStep == 2 ? (
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
                        ) : permissionsStep == 3 ? (
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
                    </>
                )}
            </Modal.Content>
            <Modal.Actions>
                <Button disabled={isLoading} color="black" onClick={() => props.setShowModifyFolderModal(false)}>
                    Cancel
                </Button>
                {showError ? (
                    <Button
                        disabled={isLoading || !props.folderPermissions['modify']}
                        loading={isLoading}
                        primary
                        onClick={() => {
                            setShowError(false)
                        }}
                    >
                        OK
                    </Button>
                ) : permissionsStep == 0 ? (
                    <Button disabled={isLoading || !props.folderPermissions['modify']} loading={isLoading} primary onClick={modifyFolder}>
                        Save
                    </Button>
                ) : permissionsStep == 1 ? (
                    <>
                        <Button disabled={isLoading} loading={isLoading} primary labelPosition="left" icon onClick={() => setPermissionsStep(3)}>
                            New User
                            <Icon name="add" />
                        </Button>
                        <Button disabled={isLoading || !props.folderPermissions['modify']} loading={isLoading} primary onClick={modifyFolder}>
                            Done
                        </Button>
                    </>
                ) : permissionsStep == 2 ? (
                    <>
                        <Button disabled={isLoading} loading={isLoading} color="red" onClick={removeUser}>
                            Remove User
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={storePermissions}>
                            Next
                        </Button>
                    </>
                ) : permissionsStep == 3 ? (
                    <>
                        <Button
                            disabled={isLoading}
                            loading={isLoading}
                            color="black"
                            onClick={() => {
                                setPermissionsStep(1)
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
                    <Button disabled={isLoading || !props.folderPermissions['modify']} loading={isLoading} primary onClick={modifyFolder}>
                        Save
                    </Button>
                )}
            </Modal.Actions>
        </W_Modal>
    )
}

KnowledgeBaseModifyFolderModal.propTypes = {
    setShowModifyFolderModal: PropTypes.func.isRequired,
    showModifyFolderModal: PropTypes.bool.isRequired,
    folderId: PropTypes.any,
    folderPermissions: PropTypes.object.isRequired,
    openDeleteFolderModal: PropTypes.func.isRequired,
    modifyFolderName: PropTypes.string,
    modifyFolderDescription: PropTypes.string,
}
