import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Icon, Modal, Input, Form, Checkbox } from 'semantic-ui-react'
import { Folder, Home } from 'react-feather'
import PropTypes from 'prop-types';

function KnowledgeBaseHeader(props) {

    const {folderId,fileId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [parentFolderId, setParentFolderId] = useState(0);
    const [folderPermissions, setFolderPermissions] = useState([]);

    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    const [showModifyFolderModal, setShowModifyFolderModal] = useState(false);
    const [modifyFolderName, setModifyFolderName] = useState("");
    const [modifyFolderDescription, setModifyFolderDescription] = useState("");
    
    useEffect(() => {
        // Get Folders
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        
        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let folderDetailsId = 0;
        if (folderId !== undefined) {
            folderDetailsId = folderId;
        }

        if (fileId == undefined) {
            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFolder?folder_id=' + folderDetailsId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setModifyFolderName(result.knowledge_base_folder_name);
                    setModifyFolderDescription(result.knowledge_base_folder_description);
                    setIsLoading(false);
                    setParentFolderId(result.knowledge_base_folder_parent_id);
                    setFolderPermissions(result.permissions);
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFile?file_id=' + fileId, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setParentFolderId(result.knowledge_base_file_folder_id)
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error)
                })
        }


    }, [folderId])

    const openNewFolderModal = () => {
        setShowNewFolderModal(true);
    }

    const openModifyFolderModal = () => {
        setShowModifyFolderModal(true);
    }

    const createNewFolder = () => {

        if (newFolderName.length > 0) {

            setIsLoading(true);

            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let folderDetailsId = 0;
            if (folderId !== undefined) {
                folderDetailsId = folderId;
            }

            const formData = new FormData()
            formData.append('folder_name', newFolderName.trim())
            formData.append('folder_parent_id', folderDetailsId)
            
            let requestOptions = {
                method: 'POST',
                headers: tokenHeaders,
                body: formData,
            }

            fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/createFolder', requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    location.reload();
                })
                .catch((error) => {
                    console.error(error)
                })

        }

    }

    return (
        <>
            {(!isLoading) && (
                <> 
                    {(folderId !== undefined || (folderId == undefined && folderPermissions["write"] == true)) && (
                        <div className="KnowledgeBaseHeader">
                            {(folderId != undefined && folderId != null) && (
                                <Link to={`/app/knowledgebase/${(parentFolderId != 0 ? parentFolderId : '')}`}>
                                    <Button labelPosition="left" icon size='tiny'>Back <Icon name="left arrow" /></Button>
                                </Link>
                            )}&nbsp;
                            {(folderPermissions != undefined && folderPermissions != null) && (
                                <>
                                    {(folderPermissions["write"] == true && props.editorMode) && (
                                        <Button onClick={openNewFolderModal} primary size='tiny'>New Folder</Button>
                                    )}&nbsp;
                                    {(folderPermissions["modify"] == true && props.editorMode) && (
                                        <Button onClick={openModifyFolderModal} primary size='tiny'>Modify Folder</Button>
                                    )}
                                    {folderPermissions["write"] == true && (
                                        <Checkbox toggle label="Use edit-mode" checked={props.editorMode} onChange={props.onChange} />
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
                            <Input disabled={isLoading} value={newFolderName} onBlur={() => {setNewFolderName(newFolderName.trim())}} onChange={(e) => {setNewFolderName(e.target.value)}} autoFocus fluid size="small" placeholder="Folder Name" />
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

            {showModifyFolderModal && (
                <Modal onClose={() => setShowModifyFolderModal(false)} onOpen={() => setShowModifyFolderModal(true)} open={showModifyFolderModal} size="mini">
                    <Modal.Header>Modify this Folder</Modal.Header>
                    <Modal.Content>
                        <Form.Field>
                            <Input disabled={isLoading} value={modifyFolderName} onBlur={() => {setModifyFolderName(modifyFolderName.trim())}} onChange={(e) => {setModifyFolderName(e.target.value)}} autoFocus fluid size="small" placeholder="Folder Name" />
                        </Form.Field><br />
                        <Form.Field>
                            <Input disabled={isLoading} value={modifyFolderDescription} onBlur={() => {setModifyFolderDescription(modifyFolderDescription.trim())}} onChange={(e) => {setModifyFolderDescription(e.target.value)}} fluid size="small" placeholder="Folder Description" />
                        </Form.Field>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowNewFolderModal(false)}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} loading={isLoading} primary onClick={createNewFolder}>
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}
        </>
    );
}

export default KnowledgeBaseHeader;
KnowledgeBaseHeader.propTypes = {
    editorMode: PropTypes.any,
    onChange: PropTypes.any
};