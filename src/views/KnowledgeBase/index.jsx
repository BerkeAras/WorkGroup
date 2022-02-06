/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Loader, Modal } from 'semantic-ui-react'
import { Database, Folder, File, Zap } from 'react-feather'

// Components
import Header from '../../components/Header/Header'
import KnowledgeBaseSidebar from '../../components/KnowledgeBase/KnowledgeBaseSidebar'
import KnowledgeBaseHeader from '../../components/KnowledgeBase/KnowledgeBaseHeader'
import KnowledgeBaseFileReader from '../../components/KnowledgeBase/KnowledgeBaseFileReader'
import KnowledgeBaseFileHistory from '../../components/KnowledgeBase/KnowledgeBaseFileHistory'
import W_Modal from '../../components/W_Modal'

function KnowledgeBase() {
    const { folderId, fileId, historyId } = useParams()
    const [folders, setFolders] = useState([])
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [editorMode, setEditorMode] = useState(false)
    const [editFileContent, setEditFileContent] = useState(false)
    const [fileExtension, setFileExtension] = useState('')
    const [modifiedFileContent, setModifiedFileContentState] = useState('')
    const [showFileHistoryModal, setShowFileHistoryModal] = useState(false)

    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorModalText, setErrorModalText] = useState('')

    useEffect(() => {
        document.title = 'KnowledgeBase – WorkGroup'

        if (window.localStorage.getItem('editor_mode') != null) {
            if (window.localStorage.getItem('editor_mode') == 'true') {
                setEditorMode(true)
            }
        }

        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + window.localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let folder_parent_id = 0
        if (folderId != null && folderId != undefined) {
            folder_parent_id = folderId
        }

        // Get Folders
        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFolders?folder_parent_id=' + folder_parent_id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setFolders(result)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error)
            })

        // Get Files
        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFiles?folder_parent_id=' + folder_parent_id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    setIsLoading(false)
                    setShowErrorModal(true)
                    setErrorModalText("This file doesn't exist. Maybe it was deleted or you don't have permission to view it.")
                } else {
                    setFiles(result)
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, [folderId, fileId, historyId])

    const handleEditorModeChange = () => {
        window.localStorage.setItem('editor_mode', !editorMode)
        setEditorMode(!editorMode)
    }

    const handleEditFileContentChange = () => {
        setEditFileContent(!editFileContent)
    }

    const handleFileExtensionChange = (fileExtensionValue) => {
        setFileExtension(fileExtensionValue)
    }

    const handleFileContentSave = () => {
        setIsLoading(true)

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + window.localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('file_id', fileId)
        formData.append('file_content', modifiedFileContent)

        const requestOptions = {
            method: 'POST',
            headers: tokenHeaders,
            body: formData,
        }

        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/saveFile', requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                setIsLoading(false)

                if (!response.success) {
                    setShowErrorModal(true)
                    setErrorModalText(response.error)
                }
            })
    }

    const setModifiedFileContent = (value) => {
        setModifiedFileContentState(value)
    }

    const showFileHistory = () => {
        setShowFileHistoryModal(!showFileHistoryModal)
    }

    return (
        <div className="app">
            <Header />

            {showErrorModal && (
                <W_Modal onClose={() => setShowErrorModal(false)} onOpen={() => setShowErrorModal(true)} open={showErrorModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>{errorModalText}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowErrorModal(false)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}

            {showFileHistoryModal && <KnowledgeBaseFileHistory isLoading={isLoading} onClose={() => setShowFileHistoryModal(false)} />}

            <KnowledgeBaseSidebar isLoading={isLoading} folderId={folderId} />
            <div id="main_content" className="main_content main_content--knowledge-base">
                <KnowledgeBaseHeader
                    fileExtension={fileExtension}
                    editFileContent={editFileContent}
                    onEditFileContent={handleEditFileContentChange}
                    editorMode={editorMode}
                    onEditorModeChange={handleEditorModeChange}
                    onFileContentSave={handleFileContentSave}
                    showFileHistory={showFileHistory}
                    isLoading={isLoading}
                />

                {folderId == undefined ? (
                    <center>
                        <Database size={35} strokeWidth={2} />
                        <h1>WorkGroup Knowledge Base</h1>
                        <span>Welcome to the WorkGroup Knowledge Base. Start by clicking on a folder.</span>
                    </center>
                ) : (
                    <>
                        {isLoading ? (
                            <div className="loader">
                                <Loader active size="large" content="Loading Files &amp; Folders..." />
                            </div>
                        ) : (
                            <>
                                {fileId == undefined ? (
                                    <>
                                        {editorMode ? (
                                            <>
                                                {folders.length == 0 && files.length == 0 && (
                                                    <center>
                                                        <Zap size={35} strokeWidth={2} />
                                                        <h1>This Folder is empty.</h1>
                                                        <span>Start by creating files &amp; folders.</span>
                                                    </center>
                                                )}
                                                {folders.map((folder, index) => {
                                                    return (
                                                        <NavLink
                                                            key={`folder-${index}`}
                                                            end
                                                            title={folder.knowledge_base_folder_description}
                                                            to={`/app/knowledgebase/${folder.id}`}
                                                            className="KnowledgeBase-Folder"
                                                        >
                                                            <Folder size={25} strokeWidth={2} /> {folder.knowledge_base_folder_name}
                                                        </NavLink>
                                                    )
                                                })}
                                                {files.map((file, index) => {
                                                    return (
                                                        <NavLink
                                                            key={`file-${index}`}
                                                            end
                                                            title={file.knowledge_base_file_description}
                                                            to={`/app/knowledgebase/${folderId == undefined || folderId == null ? 0 : folderId}/${file.id}`}
                                                            className="KnowledgeBase-File"
                                                        >
                                                            <File size={25} strokeWidth={2} /> {file.knowledge_base_file_name}{' '}
                                                            <i>
                                                                {file.knowledge_base_file_slug}.{file.knowledge_base_file_extension}
                                                            </i>
                                                        </NavLink>
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <KnowledgeBaseFileReader onFileExtensionChange={handleFileExtensionChange} editorMode={editorMode} setModifiedFileContentProp={setModifiedFileContent} />
                                        )}
                                    </>
                                ) : (
                                    <KnowledgeBaseFileReader onFileExtensionChange={handleFileExtensionChange} editorMode={editorMode} setModifiedFileContentProp={setModifiedFileContent} />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default KnowledgeBase
