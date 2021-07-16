import React, { useRef } from 'react'
import './style.scss'
import { Card, Input, Modal, Button, TextArea, Form, Popup } from 'semantic-ui-react'
import Autolinker from 'autolinker'
var linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')(linkify) // optional
var linkifyHtml = require('linkifyjs/html')

import convertToMarkup from './convertToMarkup'
import convertToText from './convertToText'
import convertOnPaste from './convertOnPaste'
import { Image, X, FileText } from 'react-feather'

const utilizeFocus = () => {
    const ref = React.createRef()
    const setFocus = () => {
        ref.current && ref.current.focus()
    }

    return { setFocus, ref }
}

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
        }
        this.publishPost = this.publishPost.bind(this)
        this.inputFocus = utilizeFocus()
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

        var fileUploadHeader = new Headers()
        fileUploadHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('image', event.target.files[0])

        var requestOptions = {
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
                }
            })
            .catch(
                (error) => console.log(error) // Handle the error response object
            )
    }

    fileChange = (event) => {
        this.setState({
            uploadFileLoading: true,
            uploadFile: event.target.files[0],
        })

        var fileUploadHeader = new Headers()
        fileUploadHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        const formData = new FormData()
        formData.append('file', event.target.files[0])

        var requestOptions = {
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
                }
            })
            .catch(
                (error) => console.log(error) // Handle the error response object
            )
    }

    publishPost = () => {
        let postContent = convertToMarkup(document.querySelector('.fake-textarea').innerHTML)
        postContent = postContent.trim()
        postContent = linkifyHtml(postContent)

        if ((postContent !== null && postContent.trim() !== '') || this.state.uploadedImages.length > 0) {
            document.querySelector('.fake-textarea').contentEditable = false

            this.setState({ isPosting: true })

            var myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            var urlencoded = new URLSearchParams()
            urlencoded.append('content', postContent)

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

            var requestOptions = {
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
                .catch((error) => console.log('error', error))
        }
    }

    imageInputRef = React.createRef()
    fileInputRef = React.createRef()

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
                        <Input size="huge" readOnly onClick={() => this.setState({ modalOpen: true })} placeholder="Share something about your thoughts…" />
                    </Card.Content>
                </Card>

                <Modal
                    onClose={() => this.setState({ uploadedImages: [], modalOpen: false })}
                    onOpen={() => {
                        this.setState({ modalOpen: true })
                        this.inputFocus.setFocus
                    }}
                    open={this.state.modalOpen}
                    size="tiny"
                >
                    <Modal.Header>Create a new post</Modal.Header>
                    <Modal.Content>
                        <div
                            className="fake-textarea"
                            onPaste={() => {
                                setTimeout(function () {
                                    document.querySelector('.fake-textarea').innerHTML = convertToMarkup(document.querySelector('.fake-textarea').innerHTML)
                                }, 100)
                            }}
                            role="textarea"
                            placeholder="Share something about your thoughts…"
                            contentEditable="true"
                            ref={this.inputFocus.ref}
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
                                trigger={<Button loading={this.state.uploadImageLoading} onClick={() => this.imageInputRef.current.click()} icon="picture" basic></Button>}
                                content="Upload images"
                                position="bottom left"
                            />
                            <Popup
                                trigger={<Button loading={this.state.uploadFileLoading} onClick={() => this.fileInputRef.current.click()} icon="file pdf" basic></Button>}
                                content="Upload PDF"
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
                </Modal>
                <input ref={this.imageInputRef} accept="image/*" type="file" hidden onChange={this.imageChange} />
                <input ref={this.fileInputRef} type="file" hidden onChange={this.fileChange} />
                <Modal
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
                </Modal>
                <Modal onClose={() => this.setState({ errorModalOpen: false })} onOpen={() => this.setState({ errorModalOpen: true })} open={this.state.errorModalOpen} size="mini">
                    <Modal.Header>Post could not be published!</Modal.Header>
                    <Modal.Content>Your post could not be published due to a server error! We are working to fix this bug.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => this.setState({ errorModalOpen: false })}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default CreatePostForm