/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, NavLink, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './style.scss'
import { Button, Loader } from 'semantic-ui-react'
import { Database, Folder, File, Zap } from 'react-feather'

// Components
import Header from '../../components/Header'
import KnowledgeBaseSidebar from '../../components/_KnowledgeBase_Sidebar';
import KnowledgeBaseHeader from '../../components/_KnowledgeBase_Header';
import KnowledgeBaseFileReader from '../../components/_KnowledgeBase_FileReader';

function KnowledgeBase() {

    const { folderId, fileId } = useParams();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editorMode, setEditorMode] = useState(false);

    useEffect(() => {
        document.title = 'KnowledgeBase – WorkGroup'

        if (window.localStorage.getItem('editor_mode') != null) {
            if (window.localStorage.getItem('editor_mode') == "true") {
                setEditorMode(true);
            }
        }

        setIsLoading(true);

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + window.localStorage.getItem('token'))
        
        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let folder_parent_id = 0;
        if (folderId != null && folderId != undefined) {
            folder_parent_id = folderId;
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

    }, [folderId, fileId])

    const handleEditorModeChange = () => {
        window.localStorage.setItem('editor_mode', !editorMode);
        setEditorMode(!editorMode)
    }

    return (
        <div className="app">
            <Header />
            <KnowledgeBaseSidebar folderId={folderId} />
            <div id="main_content" className="main_content main_content--knowledge-base">

                <KnowledgeBaseHeader onChange={handleEditorModeChange} editorMode={editorMode} />

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
                                {(fileId == undefined) ? (
                                    <>
                                        {editorMode ? (
                                            <>
                                                {(folders.length == 0 && files.length == 0) && (
                                                    <center>
                                                        <Zap size={35} strokeWidth={2} />
                                                        <h1>This Folder is empty.</h1>
                                                        <span>Start by creating files &amp; folders.</span>
                                                    </center>
                                                )}
                                                {folders.map((folder, index) => {
                                                    return (
                                                        <NavLink key={`folder-${index}`} exact title={folder.knowledge_base_folder_description} to={`/app/knowledgebase/${folder.id}`} className="KnowledgeBase-Folder">
                                                            <Folder size={25} strokeWidth={2} /> {folder.knowledge_base_folder_name}
                                                        </NavLink>
                                                    )
                                                })}
                                                {files.map((file, index) => {
                                                    return (
                                                        <NavLink key={`file-${index}`} exact title={file.knowledge_base_file_description} to={`/app/knowledgebase/${(folderId == undefined || folderId == null) ? 0 : folderId}/${file.id}`} className="KnowledgeBase-File">
                                                            <File size={25} strokeWidth={2} /> {file.knowledge_base_file_name}
                                                        </NavLink>
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <KnowledgeBaseFileReader editorMode={editorMode} />
                                        )}
                                    </>
                                ) : (
                                    <KnowledgeBaseFileReader editorMode={editorMode} />
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
