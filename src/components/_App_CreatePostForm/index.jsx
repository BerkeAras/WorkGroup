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

const utilizeFocus = () => {
    const ref = React.createRef()
    const setFocus = () => {ref.current &&  ref.current.focus()}

    return {setFocus, ref} 
}
    
class CreatePostForm extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            successModalOpen: false,
            errorModalOpen: false,
            isPosting: false,
        }
        this.publishPost = this.publishPost.bind(this)
        this.inputFocus = utilizeFocus();
    }

    reloadPage = () => {
        // Force a render without state change...
        document.querySelector('.header__logo').click();
    }

    publishPost = () => {
        let postContent = convertToMarkup(document.querySelector('.fake-textarea').innerHTML)
        postContent = postContent.trim()
        postContent = linkifyHtml(postContent)

        if (postContent !== null && postContent.trim() !== '') {
            document.querySelector('.fake-textarea').contentEditable = false

            this.setState({ isPosting: true })

            var myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            var urlencoded = new URLSearchParams()
            urlencoded.append('content', postContent)

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

    fileInputRef = React.createRef()

    uploadFile = (event) => {
        // filename
        console.log('filename ' + event.target.value)

        //file
        console.log('file ' + event.target.files[0])

        // if you are using axios then you can use below code
        //const formData = new FormData();
        // formData.append('file', event.target.files[0])
        // axios.put(
        //     'url',
        //     formData,
        //     { headers: { 'content-type': 'multipart/form-data' } }
        // ).then(data => {
        //     console.log('file uploaded')
        //     console.log(data)
        // }).catch(e => {
        //     console.log('error')
        //     console.log(e)
        // })

        // in express , node, backend code would be
        //import formidable from 'formidable'
        //(req, res) => {
        //  let form = new formidable.IncomingForm();
        //  form.parse(req, (err, fields, files) => {
        // you can get the file from files.file.path
        //  })
        // }
    }

    render() {
        return (
            <div className="new_post">
                <Card>
                    <Card.Content>
                        <Input size="huge" readOnly onClick={() => this.setState({ modalOpen: true })} placeholder="Share something about your thoughts…" />
                    </Card.Content>
                </Card>

                <Modal onClose={() => this.setState({ modalOpen: false })} onOpen={() => {this.setState({ modalOpen: true });this.inputFocus.setFocus}} open={this.state.modalOpen} size="tiny">
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
                    </Modal.Content>
                    <Modal.Actions>
                        <div className="left-actions">
                            <Popup trigger={<Button onClick={() => this.fileInputRef.current.click()} icon="picture" basic></Button>} content="Upload images" position="bottom left" />
                            <Popup trigger={<Button icon="file pdf" basic></Button>} content="Upload PDF" position="bottom left" />
                        </div>

                        <Button color="black" onClick={() => this.setState({ modalOpen: false })}>
                            Cancel
                        </Button>
                        {this.state.isPosting ? (
                            <Button content="Publish post" labelPosition="right" icon="checkmark" positive loading />
                        ) : (
                            <Button content="Publish post" labelPosition="right" icon="checkmark" onClick={() => this.publishPost()} positive />
                        )}
                    </Modal.Actions>
                </Modal>
                <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={this.fileChange}
                />
                <Modal onClose={() => {this.setState({ successModalOpen: false });this.reloadPage()}} onOpen={() => this.setState({ successModalOpen: true })} open={this.state.successModalOpen} size="mini">
                    <Modal.Header>Post created!</Modal.Header>
                    <Modal.Content>Your post has been created and can now be read by other users!</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => {this.setState({ successModalOpen: false });this.reloadPage()}}>
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
