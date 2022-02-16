import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import { Database, Folder, File, Zap } from 'react-feather'
import { Loader } from 'semantic-ui-react'
import nl2br from 'react-newline-to-break'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import PropTypes from 'prop-types'
import './style.scss'

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'tiff']

function KnowledgeBaseFileReader(props) {
    const { fileId, folderId, historyId } = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [fileContent, setFileContent] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [blobDownload, setBlobDownload] = useState('')
    const [modifiedFileTextAreaContent, setModifiedFileTextAreaContent] = useState('')
    const [errorNoIndex, setErrorNoIndex] = useState(false)
    const [error, setError] = useState(false)
    const [isRendered, setIsRendered] = useState(false)

    useEffect(() => {
        if (isRendered) {
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
                        if (result.error == 'Index not found') {
                            setErrorNoIndex(true)
                        }
                    } else {
                        setFile(result)
                        props.onFileExtensionChange(result.knowledge_base_file_extension)

                        if (!result.file_readable) {
                            // Create a download token first
                            if (!isLoading) {
                                setIsLoading(true)
                                fetch(process.env.REACT_APP_API_URL + `/api/knowledgebase/createDownloadToken?file_id=` + file_id, requestOptions)
                                    .then((response) => {
                                        if (response.ok) {
                                            return response.json()
                                        } else {
                                            setError(true)
                                            return
                                        }
                                    })
                                    .then((result) => {
                                        let token = result.token

                                        // Download the file
                                        let a = document.createElement('a')
                                        a.href = process.env.REACT_APP_API_URL + `/api/knowledgebase/readFile?file_id=${file_id}&token=${token}`
                                        a.download = result.knowledge_base_file_name + '.' + result.knowledge_base_file_extension
                                        a.click()
                                        setTimeout(() => {
                                            setIsLoading(false)
                                        }, 1000) // Wait a second to prevent duplicate downloads
                                    })
                            }
                        } else {
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
                        }
                    }
                })
        }

        if (!isRendered) {
            setIsRendered(true)
        }
    }, [historyId, fileId, folderId, isRendered])

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
                        <center style={{ margin: '50px 0' }}>
                            <Zap size={35} strokeWidth={2} />
                            <h1>
                                The file &quot;{file.knowledge_base_file_name}.{file.knowledge_base_file_extension}&quot; is being downloaded...
                            </h1>
                            <span>
                                The Download did not start? <a href="?">Try again.</a>
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
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
                                            {fileContent}
                                        </ReactMarkdown>
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
