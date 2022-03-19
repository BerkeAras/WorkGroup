import React, { useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './style.scss'
import { MentionsInput, Mention } from 'react-mentions'
import { Header, Loader, Button, Comment, Form, Feed } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import mentionStyles from './mentionStyles'
import { ThumbsUp } from 'react-feather'
import getFriendlyDate from '../../../utils/getFriendlyDate'
import { format } from 'date-fns'

import unknownAvatar from '../../../static/unknown.png'
import likeComment from '../../../utils/likeComment'

class CommentSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            placeholder: 'Create a comment',
            comments: [],
            isPosting: false,
            isLoading: false,
            newCommentContent: '',
            newCommentContentRaw: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.loadComments = this.loadComments.bind(this)
    }

    loadComments() {
        this.setState({ isLoading: true })
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
                that.setState({ placeholder: returnText, isLoading: false })

                // Get Comments
                that.setState({ comments: result, isLoading: false })
            })
            .catch((error) => {
                location.href = '/'
            })
    }

    componentDidMount() {
        this.loadComments()
    }

    handleSubmit(e, postId) {
        e.preventDefault()

        let postContent = this.state.newCommentContentRaw
        postContent = postContent.replace(/(?:\r\n|\r|\n)/g, '<br>')

        if (postContent !== null && postContent.trim() !== '' && postContent.replaceAll('<br>', '').trim() !== '') {
            this.setState({ isPosting: true, isLoading: true })

            let myHeaders = new Headers()
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            let urlencoded = new URLSearchParams()
            urlencoded.append('content', postContent)
            urlencoded.append('post_id', postId)

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow',
            }

            fetch(process.env.REACT_APP_API_URL + '/api/content/createComment', requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    this.setState({ isPosting: false, isLoading: false, newCommentContent: '' })
                    this.loadComments()
                })
        }
    }

    decodeHTMLEntities(text) {
        let textArea = document.createElement('textarea')
        textArea.innerHTML = text
        let value = textArea.value
        value.replace('&lt;br&gt;', '<br />')
        return value
    }

    fetchUsers(query, callback) {
        if (!query) return

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/search?query=' + query, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                let userResult = result[0]
                return userResult.map((user) => ({ display: user.name, id: user.id }))
            })
            .then(callback)
    }

    mentionStyles = {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#cee4e5',
            },
        },
    }

    getLikes(likes) {
        let returnStr = '0 Likes'

        if (likes == 1) {
            returnStr = '1 Like'
        } else {
            returnStr = likes + ' Likes'
        }

        return returnStr
    }

    render() {
        return (
            <Comment.Group className="comments-group" threaded>
                <Header as="h3" dividing>
                    Comments
                </Header>

                {this.state.isLoading ? (
                    <div style={{ position: 'relative', height: '130px' }}>
                        <Loader active>Loading Comments</Loader>
                    </div>
                ) : (
                    <>
                        {this.state.comments ? (
                            this.state.comments.length == 0 ? (
                                <span className="empty-comments">Sorry. We could not find any comments.</span>
                            ) : (
                                this.state.comments.map((comment) => {
                                    return (
                                        <Comment key={comment.id} id={'comment_' + comment.id}>
                                            {comment.avatar == '' ? (
                                                <Comment.Avatar href={'/app/user/' + comment.email} src={unknownAvatar} />
                                            ) : (
                                                <Comment.Avatar href={'/app/user/' + comment.email} src={process.env.REACT_APP_API_URL + '/' + comment.avatar.replace('./', '')} />
                                            )}
                                            <Comment.Content>
                                                <Comment.Author href={'/app/user/' + comment.email}>{comment.name}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span title={format(new Date(comment.created_at.replace(/-/g, '/')), 'dd.MM.yyyy - HH:mm:ss')}>
                                                        {getFriendlyDate(new Date(comment.created_at.replace(/-/g, '/')))}
                                                    </span>
                                                </Comment.Metadata>
                                                <Comment.Text dangerouslySetInnerHTML={{ __html: this.decodeHTMLEntities(comment.comment_content) }}></Comment.Text>
                                                <Comment.Actions>
                                                    <Feed.Like
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            likeComment(e)
                                                        }}
                                                        id={'comment_like_id_' + comment.id}
                                                        className={comment.hasLiked}
                                                    >
                                                        <ThumbsUp size={16} strokeWidth={2.5} />
                                                        <span>{this.getLikes(comment.likes)}</span>
                                                    </Feed.Like>
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    )
                                })
                            )
                        ) : (
                            <Navigate to="/" />
                        )}

                        <Form
                            onSubmit={(e) => {
                                this.handleSubmit(e, this.props.postId)
                            }}
                            reply
                        >
                            <br />
                            <MentionsInput
                                className="MentionsInputComment"
                                style={{ minHeight: '60px', marginBottom: '10px' }}
                                disabled={this.state.isLoading}
                                value={this.state.newCommentContent}
                                onChange={(event, newValue, newPlainTextValue, mentions) => {
                                    this.setState({ newCommentContent: event.target.value, newCommentContentRaw: newValue })
                                }}
                            >
                                <Mention displayTransform={(id, name) => `@${name}`} trigger="@" data={this.fetchUsers} style={mentionStyles} appendSpaceOnAdd />
                            </MentionsInput>

                            {this.state.isPosting === true ? (
                                <Button size="small" compact content="Add Reply" loading labelPosition="left" icon="edit" primary />
                            ) : (
                                <Button
                                    size="small"
                                    compact
                                    content="Add Reply"
                                    onClick={(e) => {
                                        this.handleSubmit(e, this.props.postId)
                                    }}
                                    labelPosition="left"
                                    icon="edit"
                                    primary
                                />
                            )}
                        </Form>
                    </>
                )}
            </Comment.Group>
        )
    }
}

export default CommentSection

CommentSection.propTypes = {
    postId: PropTypes.string,
}
