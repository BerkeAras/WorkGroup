/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './style.scss'
import { Button, Loader } from 'semantic-ui-react'
import { Database, Folder, File, Zap } from 'react-feather'

// Components
import Header from '../../components/Header'
import KnowledgeBaseSidebar from '../../components/_KnowledgeBase_Sidebar'
import KnowledgeBaseHeader from '../../components/_KnowledgeBase_Header'
import KnowledgeBaseFileReader from '../../components/_KnowledgeBase_FileReader'
import KnowledgeBaseFileHistory from '../../components/_KnowledgeBase_FileHistory'

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
                setFiles(result)
                setIsLoading(false)
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
                console.log(response)
                setIsLoading(false)
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
                                                            exact
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
                                                            exact
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