import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import { Database, Folder, File, Zap } from 'react-feather'
import { Loader } from 'semantic-ui-react'
import nl2br from 'react-newline-to-break';
import remarkGfm from 'remark-gfm'
import PropTypes from 'prop-types';
import './style.scss';

function KnowledgeBaseFileReader(props) {

    const {fileId,folderId} = useParams();
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState("");
    const [blobDownload, setBlobDownload] = useState("");

    useEffect(() => {

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        
        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/knowledgebase/getFile${((fileId == null) ? (props.editorMode ? `?file_id=` + fileId : `?folder_id=` + folderId) : (`?file_id=` + fileId))}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setFile(result);

                if (!result.file_readable) {
                    fetch(process.env.REACT_APP_API_URL + `/api/knowledgebase/readFile${((fileId == null) ? (props.editorMode ? `?file_id=` + fileId : `?folder_id=` + folderId) : (`?file_id=` + fileId))}`, requestOptions)
                        .then((response) => response.blob())
                        .then((blobResult) => {
                            var url = window.URL.createObjectURL(blobResult);
                            var a = document.createElement('a');
                            a.href = url;
                            a.download = result.knowledge_base_file_path;
                            setBlobDownload(url);
                            document.body.appendChild(a);
                            a.click();    
                            a.remove();
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                } else {
                    fetch(process.env.REACT_APP_API_URL + `/api/knowledgebase/readFile${((fileId == null) ? (props.editorMode ? `?file_id=` + fileId : `?folder_id=` + folderId) : (`?file_id=` + fileId))}`, requestOptions)
                        .then((response) => response.text())
                        .then((previewResult) => {
                            setFileContent(previewResult);
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }

            })
            .catch((error) => {
                console.error(error)
            })
        
    }, [])

    return (
        <div className="KnowledgeBaseFileReader">
            {file != null ? (
                <>
                    {!file.file_readable ? (
                        <center>
                            <Zap size={35} strokeWidth={2} />
                            <h1>The file &quot;{file.knowledge_base_file_name}&quot; is being downloaded...</h1>
                            <span>Download did not start? <a href={blobDownload} rel="noreferrer" target="_blank" download={file.knowledge_base_file_path}>Try again.</a></span>
                        </center>
                    ) : (
                        <>
                            {
                                (file.knowledge_base_file_extension == "md") ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {fileContent}
                                    </ReactMarkdown>
                                )
                                : (file.knowledge_base_file_extension == "txt") ? (
                                    <p>
                                        {nl2br(fileContent)}
                                    </p>
                                ) : (file.knowledge_base_file_extension == "html") && (
                                    <div className="KnowledgeBaseFileReader_html" dangerouslySetInnerHTML={{ __html: fileContent }}></div>
                                )
                            }
                        </>
                    )}
                </>
            ) : (
                <div className="loader">
                    <Loader active size="large" content="Loading File..." />
                </div>
            )}
        </div>
    );
}

export default KnowledgeBaseFileReader;
KnowledgeBaseFileReader.propTypes = {
    editorMode: PropTypes.any
};