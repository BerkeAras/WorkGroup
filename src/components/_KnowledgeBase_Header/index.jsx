import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Icon, Modal, Input, Form, Checkbox } from 'semantic-ui-react'
import { Folder, Home } from 'react-feather'
import PropTypes from 'prop-types'

function KnowledgeBaseHeader(props) {
    const { folderId, fileId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [parentFolderId, setParentFolderId] = useState(0)
    const [folderPermissions, setFolderPermissions] = useState([])

    const [showNewFolderModal, setShowNewFolderModal] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')

    const [openUploadFileModal, setOpenUploadFileModal] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const [newFileName, setNewFileName] = useState('')
    const [newFileDescription, setNewFileDescription] = useState('')

    const [showModifyFolderModal, setShowModifyFolderModal] = useState(false)
    const [modifyFolderName, setModifyFolderName] = useState('')
    const [modifyFolderDescription, setModifyFolderDescription] = useState('')

    const [showModifyFileModal, setShowModifyFileModal] = useState(false)
    const [modifyFileName, setModifyFileName] = useState('')
    const [modifyFileDescription, setModifyFileDescription] = useState('')
    const [modifyFileUpdateContent, setModifyFileUpdateContent] = useState(false)

    const [showDeleteFileModal, setShowDeleteFileModal] = useState(false)
    const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false)

    const [openNewFileModal, setOpenNewFileModal] = useState(false)

    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorModalText, setErrorModalText] = useState('')

    useEffect(() => {
        // Get Folders
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let folderDetailsId = 0
        if (folderId !== undefined) {
            folderDetailsId = folderId
        }

        if (fileId == undefined) {
            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFolder?folder_id=' + folderDetailsId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setModifyFolderName(result.knowledge_base_folder_name !== null ? result.knowledge_base_folder_name : '')
                    setModifyFolderDescription(result.knowledge_base_folder_description !== null ? result.knowledge_base_folder_description : '')
                    setIsLoading(false)
                    setParentFolderId(result.knowledge_base_folder_parent_id)
                    setFolderPermissions(result.permissions)
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFile?file_id=' + fileId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setFolderPermissions(result.permissions)
                    setParentFolderId(result.knowledge_base_file_folder_id)
                    setModifyFileName(result.knowledge_base_file_name)
                    setModifyFileDescription(result.knowledge_base_file_description)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [folderId])

    const openNewFolderModal = () => {
        setShowNewFolderModal(true)
    }

    const openModifyFolderModal = () => {
        setShowModifyFolderModal(true)
    }

    const openDeleteFileModal = () => {
        setShowModifyFileModal(false)
        setShowDeleteFileModal(true)
    }

    const openDeleteFolderModal = () => {
        setShowModifyFolderModal(false)
        setShowDeleteFolderModal(true)
    }

    const openFileUpdateModal = () => {
        setShowModifyFileModal(true)
    }

    const createNewFolder = () => {
        if (newFolderName.length > 0) {
            setIsLoading(true)

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (folderId !== undefined) {
                folderDetailsId = folderId
            }

            const formData = new FormData()
            formData.append('folder_name', newFolderName)
            formData.append('folder_parent_id', folderDetailsId)

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
                        setShowErrorModal(true)
                        setErrorModalText(result.error)
                    } else {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const modifyFolder = () => {
        if (modifyFolderName.length > 0) {
            setIsLoading(true)

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (folderId !== undefined) {
                folderDetailsId = folderId
            }

            const formData = new FormData()
            formData.append('folder_name', modifyFolderName)
            formData.append('folder_description', modifyFolderDescription)
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
                        setShowErrorModal(true)
                        setErrorModalText(result.error)
                    } else {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const modifyFile = () => {
        setIsLoading(true)

        if (modifyFileName.length > 0) {
            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (folderId !== undefined) {
                folderDetailsId = folderId
            }

            const formData = new FormData()
            formData.append('file_name', modifyFileName)
            formData.append('file_description', modifyFileDescription)
            formData.append('file_id', fileId)
            formData.append('modify_file', modifyFileUpdateContent)
            formData.append('modified_file', uploadFile)

            let requestOptions = {
                method: 'POST',
                headers: tokenHeaders,
                body: formData,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/modifyFile', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)

                    if (!result.success) {
                        setShowErrorModal(true)
                        setErrorModalText(result.error)
                    } else {
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const fileChange = (e) => {
        setUploadFile(e.target.files[0])
    }

    const uploadNewFile = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', folderId)
        formData.append('file_name', newFileName)
        formData.append('file', uploadFile)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/uploadFile', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)

                if (!result.success) {
                    setShowErrorModal(true)
                    setErrorModalText(result.error)
                } else {
                    window.location.reload()
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteFile = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', folderId)
        formData.append('file_id', fileId)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/deleteFile', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                location.href = `/app/knowledgebase/${parentFolderId != 0 ? parentFolderId : ''}`
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteFolder = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('folder_id', folderId)

        let requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/deleteFolder', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                location.href = `/app/knowledgebase/${parentFolderId != 0 ? parentFolderId : ''}`
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const createNewFile = () => {
        if (newFileName.length > 0) {
            setIsLoading(true)

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0
            if (folderId !== undefined) {
                folderDetailsId = folderId
            }

            const formData = new FormData()
            formData.append('file_name', newFileName)
            formData.append('file_description', newFileDescription)
            formData.append('folder_id', folderDetailsId)

            let requestOptions = {
                method: 'POST',
                headers: tokenHeaders,
                body: formData,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/createNewFile', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setIsLoading(false)

                    if (!result.success) {
                        setShowErrorModal(true)
                        setErrorModalText(result.error)
                    } else {
                        location.href = `/app/knowledgebase/${result.folder_id}/${result.file_id}`
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    return (
        <>
            {!isLoading && (
                <>
                    {(folderId !== undefined || (folderId == undefined && folderPermissions['write'] == true)) && (
                        <div className="KnowledgeBaseHeader">
                            {folderId != undefined &&
                                folderId != null &&
                                (props.isLoading ? (
                                    <Button loading={props.isLoading} disabled={props.isLoading} labelPosition="left" icon size="tiny">
                                        Back <Icon name="left arrow" />
                                    </Button>
                                ) : (
                                    <Link to={`/app/knowledgebase/${parentFolderId != 0 ? parentFolderId : ''}`}>
                                        <Button labelPosition="left" icon size="tiny">
                                            Back <Icon name="left arrow" />
                                        </Button>
                                    </Link>
                                ))}
                            &nbsp;
                            {folderPermissions != undefined && folderPermissions != null && (
                                <>
                                    {folderPermissions['write'] == true && fileId == undefined && props.editorMode && (
                                        <Button loading={props.isLoading} disabled={props.isLoading} onClick={openNewFolderModal} primary size="tiny">
                                            New Folder
                                        </Button>
                                    )}
                                    &nbsp;
                                    {folderPermissions['modify'] == true && fileId == undefined && props.editorMode && folderId != undefined && (
                                        <Button loading={props.isLoading} disabled={props.isLoading} onClick={openModifyFolderModal} primary size="tiny">
                                            Modify Folder
                                        </Button>
                                    )}
                                    &nbsp;
                                    {folderPermissions['write'] == true && fileId == undefined && folderId != undefined && props.editorMode && (
                                        <>
                                            <Button
                                                loading={props.isLoading}
                                                disabled={props.isLoading}
                                                onClick={() => {
                                                    setOpenUploadFileModal(true)
                                                }}
                                                primary
                                                size="tiny"
                                            >
                                                Upload File
                                            </Button>
                                            &nbsp;
                                            <Button
                                                loading={props.isLoading}
                                                disabled={props.isLoading}
                                                onClick={() => {
                                                    setOpenNewFileModal(true)
                                                }}
                                                primary
                                                size="tiny"
                                            >
                                                New Markdown-File
                                            </Button>
                                        </>
                                    )}
                                    &nbsp;
                                    {fileId !== undefined && folderPermissions['modify'] == true && props.editorMode && (
                                        <Button loading={props.isLoading} disabled={props.isLoading} onClick={openFileUpdateModal} basic size="tiny">
                                            Update File
                                        </Button>
                                    )}
                                    &nbsp;
                                    {folderPermissions['modify'] == true && props.editorMode && props.fileExtension == 'md' && (
                                        <Button loading={props.isLoading} disabled={props.isLoading} onClick={props.onFileContentSave} primary size="tiny">
                                            Save File
                                        </Button>
                                    )}
                                    &nbsp;
                                    {fileId !== undefined && (
                                        <Button loading={props.isLoading} disabled={props.isLoading} onClick={props.showFileHistory} basic size="tiny">
                                            <Icon name="history" />
                                            History
                                        </Button>
                                    )}
                                    &nbsp;
                                    {folderPermissions['write'] == true && (
                                        <Checkbox toggle disabled={props.isLoading} label="Use edit-mode" checked={props.editorMode} onChange={props.onEditorModeChange} />
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {showNewFolderModal && (
                <Modal onClose={() => setShowNewFolderModal(false)} onOpen={() => setShowNewFolderModal(true)} open={showNewFolderModal} size="mini">
                    <Modal.Header>Create a new Folder</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={newFolderName}
                                onChange={(e) => {
                                    setNewFolderName(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="Folder Name"
                            />
                        </Form.Field>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowNewFolderModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={createNewFolder}>
                            Create
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {openUploadFileModal && (
                <Modal onClose={() => setOpenUploadFileModal(false)} onOpen={() => setOpenUploadFileModal(true)} open={openUploadFileModal} size="mini">
                    <Modal.Header>Upload a File</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={newFileName}
                                onChange={(e) => {
                                    setNewFileName(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="File Name"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                type="file"
                                fluid
                                size="small"
                                onChange={(e) => {
                                    fileChange(e)
                                }}
                            />
                        </Form.Field>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setOpenUploadFileModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={uploadNewFile}>
                            Create
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {showModifyFolderModal && (
                <Modal onClose={() => setShowModifyFolderModal(false)} onOpen={() => setShowModifyFolderModal(true)} open={showModifyFolderModal} size="mini">
                    <Modal.Header>Modify this Folder</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={modifyFolderName}
                                onChange={(e) => {
                                    setModifyFolderName(e.target.value)
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
                                disabled={isLoading}
                                value={modifyFolderDescription}
                                onChange={(e) => {
                                    setModifyFolderDescription(e.target.value)
                                }}
                                fluid
                                size="small"
                                placeholder="Folder Description"
                            />
                        </Form.Field>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="red" onClick={openDeleteFolderModal}>
                            Delete Folder
                        </Button>
                        <Button disabled={isLoading} color="black" onClick={() => setShowModifyFolderModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={modifyFolder}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {showModifyFileModal && (
                <Modal onClose={() => setShowModifyFileModal(false)} onOpen={() => setShowModifyFileModal(true)} open={showModifyFileModal} size="mini">
                    <Modal.Header>Modify this File</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={modifyFileName}
                                onChange={(e) => {
                                    setModifyFileName(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="File Name"
                            />
                            <small>Files called &apos;index&apos; are the start pages of folders.</small>
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={modifyFileDescription}
                                onChange={(e) => {
                                    setModifyFileDescription(e.target.value)
                                }}
                                fluid
                                size="small"
                                placeholder="File Description"
                            />
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Checkbox
                                disabled={props.isLoading}
                                checked={modifyFileUpdateContent}
                                onChange={() => {
                                    setModifyFileUpdateContent(!modifyFileUpdateContent)
                                }}
                                label="Update File"
                            />
                        </Form.Field>
                        {modifyFileUpdateContent && (
                            <Form.Field>
                                <br />
                                <Input
                                    disabled={isLoading}
                                    type="file"
                                    fluid
                                    size="small"
                                    onChange={(e) => {
                                        fileChange(e)
                                    }}
                                />
                            </Form.Field>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="red" onClick={openDeleteFileModal}>
                            Delete File
                        </Button>
                        <Button disabled={isLoading} color="black" onClick={() => setShowModifyFileModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={modifyFile}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {showDeleteFileModal && (
                <Modal onClose={() => setShowDeleteFileModal(false)} onOpen={() => setShowDeleteFileModal(true)} open={showDeleteFileModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>Do you really want to delete this file? You cannot undo this operation!</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowDeleteFileModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} color="red" onClick={deleteFile}>
                            Delete irreversibly
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {showDeleteFolderModal && (
                <Modal onClose={() => setShowDeleteFolderModal(false)} onOpen={() => setShowDeleteFolderModal(true)} open={showDeleteFolderModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>Do you really want to delete this folder? You cannot undo this operation!</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowDeleteFolderModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} color="red" onClick={deleteFolder}>
                            Delete irreversibly
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {openNewFileModal && (
                <Modal
                    onClose={() => {
                        setOpenNewFileModal(false)
                        setNewFileName('')
                        setNewFileDescription('')
                    }}
                    onOpen={() => {
                        setOpenNewFileModal(true)
                        setNewFileName('')
                        setNewFileDescription('')
                    }}
                    open={openNewFileModal}
                    size="mini"
                >
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={newFileName}
                                onChange={(e) => {
                                    setNewFileName(e.target.value)
                                }}
                                autoFocus
                                fluid
                                size="small"
                                placeholder="New File Name"
                            />
                            <small>Files called &apos;index&apos; are the start pages of folders.</small>
                        </Form.Field>
                        <br />
                        <Form.Field>
                            <Input
                                disabled={isLoading}
                                value={newFileDescription}
                                onChange={(e) => {
                                    setNewFileDescription(e.target.value)
                                }}
                                fluid
                                size="small"
                                placeholder="File Description"
                            />
                        </Form.Field>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setOpenNewFileModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={createNewFile}>
                            Create File
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}

            {showErrorModal && (
                <Modal onClose={() => setShowErrorModal(false)} onOpen={() => setShowErrorModal(true)} open={showErrorModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>{errorModalText}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowErrorModal(false)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}
        </>
    )
}

export default KnowledgeBaseHeader
KnowledgeBaseHeader.propTypes = {
    fileExtension: PropTypes.any,
    editFileContent: PropTypes.any,
    onEditFileContent: PropTypes.any,
    editorMode: PropTypes.any,
    onEditorModeChange: PropTypes.any,
    onFileContentSave: PropTypes.any,
    showFileHistory: PropTypes.any,
    isLoading: PropTypes.bool,
}
