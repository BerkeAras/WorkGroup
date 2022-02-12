import React, { useRef } from 'react'
import './style.scss'
import { Card, Input, Modal, Button, TextArea, Form, Popup } from 'semantic-ui-react'
import PropTypes from 'prop-types'
let linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')(linkify) // optional
let linkifyHtml = require('linkifyjs/html')
import W_Modal from '../../W_Modal'

import convertToMarkup from './convertToMarkup'
import convertToText from './convertToText'
import convertOnPaste from './convertOnPaste'
import { Image, X, FileText } from 'react-feather'

class CreatePostForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            successModalOpen: false,
            errorModalOpen: false,
            isPosting: false,
            uploadImage: [],
            uploadedImages: [],
            uploadImageLoading: false,
            uploadFile: [],
            uploadedFiles: [],
            uploadFileLoading: false,
            uploadFileSizeError: false,
            uploadFileError: false,
        }
        this.publishPost = this.publishPost.bind(this)
        this.textareaRef = React.createRef(null)
        this.imageInputRef = React.createRef(null)
        this.fileInputRef = React.createRef(null)
    }

    reloadPage = () => {
        // Force a render without state change...
        document.querySelector('.header__logo').click()
    }

    imageChange = (event) => {
        this.setState({
            uploadImageLoading: true,
            uploadImage: event.target.files[0],
        })

        let fileUploadHeader = new Headers()
        fileUploadHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('image', event.target.files[0])

        let requestOptions = {
            method: 'POST',
            headers: fileUploadHeader,
            body: formData,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/content/uploadImage', requestOptions)
            .then(
                (response) => response.json() // if the response is a JSON object
            )
            .then((success) => {
                if (success.error == false) {
                    let uploadedImages = this.state.uploadedImages
                    uploadedImages.push(success)
                    this.setState({
                        uploadImageLoading: false,
                        uploadImage: [],
                        uploadedImages: uploadedImages,
                    })
                    this.imageInputRef.current.value = ''
                } else {
                    if (success.message == 'File too big!') {
                        this.setState({
                            uploadImageLoading: false,
                            uploadImage: [],
                            uploadFileSizeError: true,
                        })
                        this.imageInputRef.current.value = ''
                    } else {
                        this.setState({
                            uploadImageLoading: false,
                            uploadImage: [],
                            uploadFileSizeError: false,
                            uploadFileError: true,
                        })
                        this.imageInputRef.current.value = ''
                    }
                }
            })
    }

    fileChange = (event) => {
        this.setState({
            uploadFileLoading: true,
            uploadFile: event.target.files[0],
        })

        let fileUploadHeader = new Headers()
        fileUploadHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('file', event.target.files[0])

        let requestOptions = {
            method: 'POST',
            headers: fileUploadHeader,
            body: formData,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/content/uploadFile', requestOptions)
            .then(
                (response) => response.json() // if the response is a JSON object
            )
            .then((success) => {
                if (success.error == false) {
                    let uploadedFiles = this.state.uploadedFiles
                    uploadedFiles.push(success)
                    this.setState({
                        uploadFileLoading: false,
                        uploadFiles: [],
                        uploadedFiles: uploadedFiles,
                    })
                    this.fileInputRef.current.value = ''
                } else {
                    if (success.message == 'File too big!') {
                        this.setState({
                            uploadFileLoading: false,
                            uploadFiles: [],
                            uploadFileSizeError: true,
                        })
                        this.imageInputRef.current.value = ''
                    } else {
                        this.setState({
                            uploadFileLoading: false,
                            uploadFiles: [],
                            uploadFileSizeError: false,
                            uploadFileError: true,
                        })
                        this.imageInputRef.current.value = ''
                    }
                }
            })
    }

    publishPost = () => {
        let postContent = convertToMarkup(document.querySelector('.fake-textarea').innerHTML)
        postContent = postContent.trim()
        postContent = linkifyHtml(postContent)

        if ((postContent !== null && postContent.trim() !== '') || this.state.uploadedImages.length > 0) {
            document.querySelector('.fake-textarea').contentEditable = false

            this.setState({ isPosting: true })

            let myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            let urlencoded = new URLSearchParams()
            urlencoded.append('content', postContent)
            if (this.props.group !== undefined) {
                urlencoded.append('groupId', this.props.group)
            }

            if (this.state.uploadedImages.length > 0) {
                let imagesArray = []
                this.state.uploadedImages.forEach((uploadedImage) => {
                    imagesArray.push(uploadedImage.url.replace('./static/', ''))
                })
                urlencoded.append('images', JSON.stringify(imagesArray))
            }

            if (this.state.uploadedFiles.length > 0) {
                let filesArray = []
                this.state.uploadedFiles.forEach((uploadedFile) => {
                    filesArray.push([uploadedFile.original_url.replace('./static/files/', ''), uploadedFile.url.replace('./static/files/', '')])
                })
                urlencoded.append('files', JSON.stringify(filesArray))
            }

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow',
            }

            fetch(process.env.REACT_APP_API_URL + '/api/content/createPost', requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    if (result == '1') {
                        this.setState({ modalOpen: false })
                        this.setState({ isPosting: false })
                        this.setState({ successModalOpen: true })
                    } else {
                        this.setState({ modalOpen: false })
                        this.setState({ isPosting: false })
                        this.setState({ errorModalOpen: true })
                    }
                })
        }
    }

    removeUploadedImage = (index) => {
        let uploadedImagesState = this.state.uploadedImages
        uploadedImagesState.splice(index, 1)
        this.setState({ uploadedImages: uploadedImagesState })
    }

    removeUploadedFile = (index) => {
        let uploadedFileState = this.state.uploadedFiles
        uploadedFileState.splice(index, 1)
        this.setState({ uploadedFiles: uploadedFileState })
    }

    render() {
        return (
            <div className="new_post">
                <Card>
                    <Card.Content>
                        <Input
                            size="huge"
                            readOnly
                            onClick={() => {
                                this.setState({ modalOpen: true })
                                setTimeout(() => {
                                    this.textareaRef.current.focus()
                                }, 1)
                            }}
                            placeholder="Share something about your thoughts…"
                        />
                    </Card.Content>
                </Card>

                {this.state.modalOpen && (
                    <W_Modal
                        onClose={() => this.setState({ uploadedImages: [], modalOpen: false })}
                        onOpen={() => {
                            this.setState({ modalOpen: true })
                        }}
                        open={this.state.modalOpen}
                        size="tiny"
                    >
                        <Modal.Header>Create a new post</Modal.Header>
                        <Modal.Content>
                            <input ref={this.imageInputRef} accept="image/*" type="file" onChange={this.imageChange} hidden />
                            <input ref={this.fileInputRef} type="file" onChange={this.fileChange} hidden />
                            <div
                                className="fake-textarea"
                                onPaste={() => {
                                    setTimeout(function () {
                                        document.querySelector('.fake-textarea').innerHTML = convertToMarkup(document.querySelector('.fake-textarea').innerHTML)
                                    }, 100)
                                }}
                                autoFocus
                                role="textarea"
                                placeholder="Share something about your thoughts…"
                                contentEditable="true"
                                ref={this.textareaRef}
                            ></div>
                            {this.state.uploadedImages.length !== 0 && (
                                <div className="uploaded-images">
                                    {this.state.uploadedImages.map((uploadedImage, index) => {
                                        return (
                                            <div key={index} className="uploaded-images-item">
                                                <div className="uploaded-images-item-icon">
                                                    <Image size={20} />
                                                </div>
                                                <span className="uploaded-images-item-title">{uploadedImage.original_url.replace('./static/', '')}</span>
                                                <a
                                                    href="#removeItem"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        this.removeUploadedImage(index)
                                                    }}
                                                    className="uploaded-images-item-remove"
                                                >
                                                    <X size={20}></X>
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {this.state.uploadedFiles.length !== 0 && (
                                <div className="uploaded-files">
                                    {this.state.uploadedFiles.map((uploadedFile, index) => {
                                        return (
                                            <div key={index} className="uploaded-files-item">
                                                <div className="uploaded-files-item-icon">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="uploaded-files-item-title">{uploadedFile.original_url.replace('./static/', '')}</span>
                                                <a
                                                    href="#removeItem"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        this.removeUploadedFile(index)
                                                    }}
                                                    className="uploaded-files-item-remove"
                                                >
                                                    <X size={20}></X>
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </Modal.Content>
                        <Modal.Actions>
                            <div className="left-actions">
                                <Popup
                                    trigger={
                                        <Button
                                            loading={this.state.uploadImageLoading}
                                            onClick={() => {
                                                this.imageInputRef.current.click()
                                            }}
                                            icon="picture"
                                            basic
                                        ></Button>
                                    }
                                    content="Upload images"
                                    position="bottom left"
                                />
                                <Popup
                                    trigger={<Button loading={this.state.uploadFileLoading} onClick={() => this.fileInputRef.current.click()} icon="file pdf" basic></Button>}
                                    content="Upload Files"
                                    position="bottom left"
                                />
                            </div>

                            <Button color="black" onClick={() => this.setState({ uploadedImages: [], modalOpen: false })}>
                                Cancel
                            </Button>
                            {this.state.isPosting ? (
                                <Button content="Publish post" labelPosition="right" icon="checkmark" positive loading />
                            ) : (
                                <Button content="Publish post" labelPosition="right" icon="checkmark" onClick={() => this.publishPost()} positive />
                            )}
                        </Modal.Actions>
                    </W_Modal>
                )}
                {this.state.successModalOpen && (
                    <W_Modal
                        onClose={() => {
                            this.setState({ successModalOpen: false })
                            this.reloadPage()
                        }}
                        onOpen={() => this.setState({ successModalOpen: true })}
                        open={this.state.successModalOpen}
                        size="mini"
                    >
                        <Modal.Header>Post created!</Modal.Header>
                        <Modal.Content>Your post has been created and can now be read by other users!</Modal.Content>
                        <Modal.Actions>
                            <Button
                                color="black"
                                onClick={() => {
                                    this.setState({ successModalOpen: false })
                                    this.reloadPage()
                                }}
                            >
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}
                {this.state.errorModalOpen && (
                    <W_Modal onClose={() => this.setState({ errorModalOpen: false })} onOpen={() => this.setState({ errorModalOpen: true })} open={this.state.errorModalOpen} size="mini">
                        <Modal.Header>Post could not be published!</Modal.Header>
                        <Modal.Content>Your post could not be published due to a server error! We are working to fix this bug.</Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={() => this.setState({ errorModalOpen: false })}>
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}
                {this.state.uploadFileSizeError && (
                    <W_Modal
                        onClose={() => this.setState({ uploadFileSizeError: false })}
                        onOpen={() => this.setState({ uploadFileSizeError: true })}
                        open={this.state.uploadFileSizeError}
                        size="mini"
                    >
                        <Modal.Header>Your file could not be uploaded!</Modal.Header>
                        <Modal.Content>Unfortunately, your file is too big to be uploaded.</Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={() => this.setState({ uploadFileSizeError: false })}>
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}
                {this.state.uploadFileError && (
                    <W_Modal onClose={() => this.setState({ uploadFileError: false })} onOpen={() => this.setState({ uploadFileError: true })} open={this.state.uploadFileError} size="mini">
                        <Modal.Header>Your file could not be uploaded!</Modal.Header>
                        <Modal.Content>Unfortunately, your file could not be uploaded. Please try again later.</Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={() => this.setState({ uploadFileError: false })}>
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}
            </div>
        )
    }
}

export default CreatePostForm
CreatePostForm.propTypes = {
    group: PropTypes.any,
}
