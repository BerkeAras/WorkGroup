import React, { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './style.scss'
import { Feed, Icon, Header, Loader, Button, Comment, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import unknownAvatar from '../../../static/unknown.png'

class CommentSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: 'Create a comment',
            comments: [],
            isPosting: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.loadComments = this.loadComments.bind(this)
    }

    loadComments() {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let returnText
        const that = this

        fetch(process.env.REACT_APP_API_URL + '/api/content/getComments?id=' + String(this.props.postId), requestOptions)
            .then((response) => response.json())
            .then((result) => {
                // Count
                if (result.length == 0) {
                    returnText = 'Create the first comment'
                } else {
                    returnText = 'Create a comment'
                }
                that.setState({ placeholder: returnText })

                // Get Comments
                that.setState({ comments: result })
            })
            .catch((error) => {
                location.href = '/'
            })
    }

    componentDidMount() {
        this.loadComments()
    }

    handleSubmit(e) {
        e.preventDefault()

        let element

        if (e.target.tagName.toLowerCase() == 'button') {
            element = e.target.parentNode
        } else {
            element = e.target.parentNode.parentNode
        }

        let postContent = element.querySelector('textarea').value
        postContent = postContent.replace(/(?:\r\n|\r|\n)/g, '<br>')

        if (postContent !== null && postContent.trim() !== '' && postContent.replaceAll('<br>', '').trim() !== '') {
            this.setState({ isPosting: true })

            let myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            let urlencoded = new URLSearchParams()
            urlencoded.append('content', postContent)
            urlencoded.append('post_id', element.querySelector('textarea').id.replace('comment_textarea_', ''))

            element.querySelector('textarea').disabled = true

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow',
            }

            fetch(process.env.REACT_APP_API_URL + '/api/content/createComment', requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    if (result == '1') {
                        this.setState({ isPosting: false })
                    } else {
                        this.setState({ isPosting: false })
                    }

                    element.querySelector('textarea').disabled = false
                    element.querySelector('textarea').value = ''
                    this.loadComments()
                })
        }
    }

    getDate(date) {
        let newDate = new Date(date.replace(/-/g, '/'))

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        let todaysDate = new Date()

        let dateString = ''

        if (newDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
            todaysDate = new Date()
            newDate = new Date(date.replace(/-/g, '/'))
            let currentHours = newDate.getHours()
            currentHours = ('0' + currentHours).slice(-2)

            dateString = 'Today, ' + currentHours + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()
        } else {
            dateString = newDate.toLocaleDateString(process.env.REACT_APP_LOCALE, options)
        }

        return dateString
    }

    decodeHTMLEntities(text) {
        let textArea = document.createElement('textarea')
        textArea.innerHTML = text
        let value = textArea.value
        value.replace('&lt;br&gt;', '<br />')
        return value
    }

    render() {
        return (
            <Comment.Group className="comments-group" threaded>
                <Header as="h3" dividing>
                    Comments
                </Header>

                {this.state.comments ? (
                    this.state.comments.length == 0 ? (
                        <span className="empty-comments">Sorry. We could not find any comments.</span>
                    ) : (
                        this.state.comments.map((comment) => {
                            return (
                                <Comment key={comment.id}>
                                    {comment.avatar == '' ? (
                                        <Comment.Avatar href={'/app/user/' + comment.email} src={unknownAvatar} />
                                    ) : (
                                        <Comment.Avatar href={'/app/user/' + comment.email} src={process.env.REACT_APP_API_URL + '/' + comment.avatar.replace('./', '')} />
                                    )}
                                    <Comment.Content>
                                        <Comment.Author href={'/app/user/' + comment.email}>{comment.name}</Comment.Author>
                                        <Comment.Metadata>
                                            <span>{this.getDate(comment.created_at)}</span>
                                        </Comment.Metadata>
                                        <Comment.Text dangerouslySetInnerHTML={{ __html: this.decodeHTMLEntities(comment.comment_content) }}></Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            )
                        })
                    )
                ) : (
                    <Navigate to="/" />
                )}

                <Form onSubmit={this.handleSubmit} reply>
                    <Form.TextArea id={'comment_textarea_' + this.props.postId} placeholder={this.state.placeholder} />

                    {this.state.isPosting === true ? (
                        <Button size="small" compact content="Add Reply" loading labelPosition="left" icon="edit" primary />
                    ) : (
                        <Button size="small" compact content="Add Reply" onClick={this.handleSubmit} labelPosition="left" icon="edit" primary />
                    )}
                </Form>
            </Comment.Group>
        )
    }
}

export default CommentSection

CommentSection.propTypes = {
    postId: PropTypes.string,
}
