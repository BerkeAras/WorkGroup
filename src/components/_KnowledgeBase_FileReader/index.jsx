import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import { Database, Folder, File, Zap } from 'react-feather'
import { Loader } from 'semantic-ui-react'
import nl2br from 'react-newline-to-break'
import remarkGfm from 'remark-gfm'
import PropTypes from 'prop-types'
import './style.scss'

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'tiff']

function KnowledgeBaseFileReader(props) {
    const { fileId, folderId, historyId } = useParams()
    const [file, setFile] = useState(null)
    const [fileContent, setFileContent] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [blobDownload, setBlobDownload] = useState('')
    const [modifiedFileTextAreaContent, setModifiedFileTextAreaContent] = useState('')
    const [errorNoIndex, setErrorNoIndex] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let file_id = fileId
        if (historyId != undefined && historyId != null) {
            file_id = 'history_' + historyId
        }

        fetch(
            process.env.REACT_APP_API_URL + `/api/knowledgebase/getFile${file_id == null ? (props.editorMode ? `?file_id=` + file_id : `?folder_id=` + folderId) : `?file_id=` + file_id}`,
            requestOptions
        )
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    setError(true)
                    return
                }
            })
            .then((result) => {
                if (result.error) {
                    console.log('RES_Error', result.error)
                    if (result.error == 'Index not found') {
                        setErrorNoIndex(true)
                    }
                } else {
                    console.log('RES_noError')
                    setFile(result)
                    props.onFileExtensionChange(result.knowledge_base_file_extension)

                    if (!result.file_readable) {
                        console.log('file not readable')
                        fetch(
                            process.env.REACT_APP_API_URL +
                                `/api/knowledgebase/readFile${file_id == null ? (props.editorMode ? `?file_id=` + file_id : `?folder_id=` + folderId) : `?file_id=` + file_id}`,
                            requestOptions
                        )
                            .then((response) => {
                                if (!response.ok) {
                                    setError(true)
                                    return
                                }
                                response.blob()
                            })
                            .then((blobResult) => {
                                let url = window.URL.createObjectURL(blobResult)
                                let a = document.createElement('a')
                                a.href = url
                                a.download = result.knowledge_base_file_path
                                setBlobDownload(url)
                                document.body.appendChild(a)
                                a.click()
                                a.remove()
                            })
                            .catch((error) => {
                                console.log('A1', error)
                            })
                    } else {
                        console.log('file readable')
                        fetch(
                            process.env.REACT_APP_API_URL +
                                `/api/knowledgebase/readFile${file_id == null ? (props.editorMode ? `?file_id=` + file_id : `?folder_id=` + folderId) : `?file_id=` + file_id}`,
                            requestOptions
                        )
                            .then((response) => response.text())
                            .then((previewResult) => {
                                props.setModifiedFileContentProp(previewResult)
                                setFileContent(previewResult)

                                if (imageExtensions.includes(result.knowledge_base_file_extension)) {
                                    setImageUrl(previewResult)
                                }
                            })
                            .catch((error) => {
                                console.log('A2', error)
                            })
                    }
                }
            })
    }, [historyId, fileId, folderId])

    return (
        <div className="KnowledgeBaseFileReader">
            {errorNoIndex ? (
                <center style={{ marginBottom: '50px' }}>
                    <Zap size={35} strokeWidth={2} />
                    <h1>An Error occurred</h1>
                    <span>This Folder does not contain a start-file.</span>
                </center>
            ) : error ? (
                <center style={{ marginBottom: '50px' }}>
                    <Zap size={35} strokeWidth={2} />
                    <h1>An Error occurred</h1>
                    <span>An unknown error occurred. Please try again later.</span>
                </center>
            ) : file != null ? (
                <>
                    {!file.file_readable ? (
                        <center>
                            <Zap size={35} strokeWidth={2} />
                            <h1>The file &quot;{file.knowledge_base_file_name}&quot; is being downloaded...</h1>
                            <span>
                                Download did not start?{' '}
                                <a href={blobDownload} rel="noreferrer" target="_blank" download={file.knowledge_base_file_path}>
                                    Try again.
                                </a>
                            </span>
                        </center>
                    ) : (
                        <>
                            {file.knowledge_base_file_extension == 'md' ? (
                                <>
                                    {props.editorMode ? (
                                        <textarea
                                            className="KnowledgeBaseFileReader_textarea"
                                            value={fileContent}
                                            onChange={(e) => {
                                                setFileContent(e.target.value)
                                                props.setModifiedFileContentProp(e.target.value)
                                            }}
                                        ></textarea>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
                                    )}
                                </>
                            ) : file.knowledge_base_file_extension == 'txt' ? (
                                <p>{nl2br(fileContent)}</p>
                            ) : file.knowledge_base_file_extension == 'html' ? (
                                <div className="KnowledgeBaseFileReader_html" dangerouslySetInnerHTML={{ __html: fileContent }}></div>
                            ) : imageExtensions.includes(file.knowledge_base_file_extension) ? (
                                <img className="KnowledgeBaseFileReader_image" src={imageUrl} alt={file.knowledge_base_file_name} />
                            ) : (
                                <center>
                                    <Zap size={35} strokeWidth={2} />
                                    <h1>The file &quot;{file.knowledge_base_file_name}&quot; is being downloaded...</h1>
                                    <span>
                                        Download did not start?{' '}
                                        <a href={blobDownload} rel="noreferrer" target="_blank" download={file.knowledge_base_file_path}>
                                            Try again.
                                        </a>
                                    </span>
                                </center>
                            )}
                        </>
                    )}
                </>
            ) : (
                <div className="loader">
                    <Loader active size="large" content="Loading File..." />
                </div>
            )}
        </div>
    )
}

export default KnowledgeBaseFileReader
KnowledgeBaseFileReader.propTypes = {
    editorMode: PropTypes.any,
    onFileExtensionChange: PropTypes.any,
    setModifiedFileContentProp: PropTypes.any,
}
