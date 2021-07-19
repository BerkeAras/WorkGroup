import React, { useRef } from 'react'
import './style.scss'
import { Feed, Modal, Loader, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { ThumbsUp, MessageCircle, Zap, FileText, Flag } from 'react-feather'
import PropTypes from 'prop-types'

import unknownAvatar from '../../static/unknown.png'

import CommentSection from '../_App_CommentSection/'
import ReportPost from '../_App_ReportPost/'

class PostsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoading: true,
            cursor: 1,
            loaded: false,
            isLoadingMore: false,
            visibleCommentSections: [],
            emptyStates: ["It's empty here. Start sharing something about your thoughts!", 'Your friends are shy. Get started and write your first post.'],
            imageModalVisible: false,
            imageModalUrl: '',
            reportModalVisible: false,
            reportModalPostId: 0,
            reportSuccessVisible: false,
            reportErrorVisible: false,
        }

        this.componentDidMount = this.componentDidMount.bind(this)
        this.componentDidUpdate = this.componentDidUpdate.bind(this)
        this.convertDate = this.convertDate.bind(this)
        this.getFriendlyDate = this.getFriendlyDate.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.getDate = this.getDate.bind(this)
        this.getLikes = this.getLikes.bind(this)
        this.getComments = this.getComments.bind(this)
        this.toggleComment = this.toggleComment.bind(this)
        this.toggleLike = this.toggleLike.bind(this)
        this.reportPost = this.reportPost.bind(this)
    }

    componentDidMount() {
        this.loadMore()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setState({
                cursor: 1,
                items: [],
            })
            setTimeout(() => {
                this.loadMore()
            }, 1)
        }
    }

    convertDate = (date) => {
        var t,
            result = null

        if (typeof mysql_string === 'string') {
            t = date.split(/[- :]/)

            //when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0)
        }

        console.log(result)

        return result
    }

    getFriendlyDate = (date) => {
        var delta = Math.round((+new Date() - date) / 1000)

        console.log(date, delta)

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7

        var fuzzy

        if (delta < 30) {
            fuzzy = 'just then.'
        } else if (delta < minute) {
            fuzzy = delta + ' seconds ago.'
        } else if (delta < 2 * minute) {
            fuzzy = 'a minute ago.'
        } else if (delta < hour) {
            fuzzy = Math.floor(delta / minute) + ' minutes ago.'
        } else if (Math.floor(delta / hour) == 1) {
            fuzzy = '1 hour ago.'
        } else if (delta < day) {
            fuzzy = Math.floor(delta / hour) + ' hours ago.'
        } else if (delta < day * 2) {
            fuzzy = 'yesterday'
        }

        return fuzzy
    }

    loadMore = () => {
        this.setState({ isLoadingMore: true })

        var loadingHeader = new Headers()
        loadingHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: loadingHeader,
            redirect: 'follow',
        }

        let filterByUser = ''

        if (this.props.user !== '*') {
            filterByUser = '&user=' + this.props.user
        }

        this.setState({ isLoading: true, error: undefined })
        fetch(process.env.REACT_APP_API_URL + `/api/content/getPosts?from=${this.state.cursor + filterByUser}`, requestOptions)
            .then((res) => res.json())
            .then(
                (res) => {
                    this.setState({ isLoadingMore: false })
                    if (res['status_code'] !== undefined) {
                        if (res['message'] === 'Token has expired') {
                            location.href = '/logout'
                            localStorage.clear()
                        }
                        console.error('ERROR: ' + res['message'])
                    } else {
                        if (this.state.items.length > 60) {
                            this.setState({ items: [] })
                        }

                        this.setState((state) => ({
                            items: [...state.items, ...res],
                            cursor: this.state.cursor + 1,
                            isLoading: false,
                            loaded: true,
                        }))
                    }
                },
                (error) => {
                    this.setState({ isLoading: false, error })
                }
            )
    }

    getDate(date) {
        var newDate = new Date(date)

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        var todaysDate = new Date()

        let dateString = ''

        if (newDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
            todaysDate = new Date()
            newDate = new Date(date)
            let currentHours = newDate.getHours()
            currentHours = ('0' + currentHours).slice(-2)

            dateString = 'Today, ' + currentHours + ':' + (newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()
        } else {
            dateString = newDate.toLocaleDateString(process.env.REACT_APP_LOCALE, options)
        }

        return dateString
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

    getComments(comments) {
        let returnStr = '0 Comments'

        if (comments == 1) {
            returnStr = '1 Comment'
        } else {
            returnStr = comments + ' Comments'
        }

        return returnStr
    }

    toggleComment(e) {
        Array.prototype.remove = function () {
            var what,
                a = arguments,
                L = a.length,
                ax
            while (L && this.length) {
                what = a[--L]
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1)
                }
            }
            return this
        }

        let element

        if (e.target.tagName.toLowerCase() === 'i' || e.target.tagName.toLowerCase() === 'span') {
            element = e.target.parentNode
        } else {
            element = e.target
        }

        let val = element.id.replace('post_comment_id_', '')
        val = parseInt(val)

        let isVisible = this.state.visibleCommentSections.includes(val)

        let newStatus

        if (!isVisible) {
            newStatus = true

            let visibleCommentSections = [...this.state.visibleCommentSections]

            // Add item to it
            visibleCommentSections.push(val)

            // Set state
            this.setState({ visibleCommentSections })
        } else {
            newStatus = false

            let visibleCommentSections = [...this.state.visibleCommentSections]
            visibleCommentSections.remove(val)

            this.setState({ visibleCommentSections })
        }
    }

    toggleLike(e) {
        e.preventDefault()

        let element
        let hasLiked = false
        let newLikeCount
        let currentLikeCount
        let postId
        let newLikeText

        if (e.target.tagName.toLowerCase() === 'i' || e.target.tagName.toLowerCase() === 'span') {
            element = e.target.parentNode
        } else {
            element = e.target
        }

        // Has liked
        hasLiked = element.classList.contains('liked')

        // Update counter

        currentLikeCount = element.querySelector('span').innerHTML.substr(0, element.querySelector('span').innerHTML.indexOf(' '))
        currentLikeCount = parseInt(currentLikeCount)

        if (hasLiked) {
            newLikeCount = currentLikeCount - 1
            hasLiked = false
        } else {
            newLikeCount = currentLikeCount + 1
            hasLiked = true
        }

        if (newLikeCount === 1) {
            newLikeText = '1 Like'
        } else {
            newLikeText = newLikeCount + ' Likes'
        }

        // Toggle liked-status
        element.parentNode.style.pointerEvents = 'none' // Set PointerEvents to none to prevent multiple requests

        postId = element.id.replace('post_like_id_', '')

        element.querySelector('span').innerHTML = newLikeText

        if (hasLiked) {
            element.classList.add('liked')
        } else {
            element.classList.remove('liked')
        }

        // Request
        var header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                id: postId,
            }),
        }

        fetch(process.env.REACT_APP_API_URL + '/api/content/likePost', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                element.parentNode.style.pointerEvents = 'all'
            })
    }

    reportPost(e, postId) {
        e.preventDefault()

        this.setState({
            reportModalVisible: true,
            reportModalPostId: postId,
        })
    }

    render() {
        return (
            <div>
                {this.state.loaded === true && (
                    <Feed>
                        {this.state.items.length > 0 ? (
                            <React.Fragment>
                                {this.state.items.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <Feed.Event className={this.state.visibleCommentSections.includes(item.id) == 0 ? 'event--no-comments-visible' : ''}>
                                            <Feed.Label className="user-avatar">
                                                <Link to={'/app/user/' + item.email}>
                                                    {item.avatar == '' ? <img src={unknownAvatar} /> : <img src={process.env.REACT_APP_API_URL + '/' + item.avatar.replace('./', '')} />}
                                                </Link>
                                            </Feed.Label>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    <Link className="user" to={'/app/user/' + item.email}>
                                                        {item.name}
                                                    </Link>
                                                    <Feed.Date>{this.getDate(item.created_at)}</Feed.Date>
                                                </Feed.Summary>
                                                <Feed.Extra text>
                                                    <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                                    {item.images.length > 0 && (
                                                        <div className="post-images">
                                                            {item.images.map((postImage, index) => {
                                                                return (
                                                                    <div key={index} className={`post-image ${item.images.length == 1 && 'post-image--single'}`}>
                                                                        <a
                                                                            href="#"
                                                                            onClick={(e) => {
                                                                                e.preventDefault()
                                                                                this.setState({
                                                                                    imageModalUrl: process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url,
                                                                                    imageModalVisible: true,
                                                                                })
                                                                            }}
                                                                        >
                                                                            <img src={process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url} />
                                                                        </a>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                    {item.files.length > 0 && (
                                                        <div className="post-files">
                                                            {item.files.map((postFile, index) => {
                                                                return (
                                                                    <a
                                                                        href={process.env.REACT_APP_API_URL + '/static/files/' + postFile.post_file_url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        download
                                                                        key={index}
                                                                        className="post-file"
                                                                    >
                                                                        <div className="post-file-icon">
                                                                            <FileText size={20} strokeWidth={2} />
                                                                        </div>
                                                                        <span className="post-file-text">{postFile.post_file_original}</span>
                                                                    </a>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </Feed.Extra>
                                                <Feed.Meta>
                                                    <Feed.Like href="#" onClick={this.toggleLike} id={'post_like_id_' + item.id} className={item.hasLiked}>
                                                        <ThumbsUp size={16} strokeWidth={2.5} />
                                                        <span>{this.getLikes(item.likes)}</span>
                                                    </Feed.Like>
                                                    <a href="#" className="comment-button" onClick={this.toggleComment} id={'post_comment_id_' + item.id}>
                                                        <MessageCircle size={16} strokeWidth={2.5} />
                                                        <span>{this.getComments(item.comments)}</span>
                                                    </a>
                                                    <a
                                                        href="#"
                                                        className="report-button"
                                                        onClick={(e) => {
                                                            this.reportPost(e, item.id)
                                                        }}
                                                        id={'post_comment_id_' + item.id}
                                                    >
                                                        <span>Report</span>
                                                        <Flag size={16} strokeWidth={2.5} />
                                                    </a>
                                                </Feed.Meta>
                                            </Feed.Content>
                                        </Feed.Event>
                                        {this.state.visibleCommentSections.includes(item.id) > 0 && <CommentSection postId={item.id.toString()} />}
                                    </React.Fragment>
                                ))}

                                <div className="load-more-container">
                                    {this.state.isLoadingMore === true ? (
                                        <Button loading primary>
                                            Load more
                                        </Button>
                                    ) : (
                                        <Button primary onClick={this.loadMore}>
                                            Load more
                                        </Button>
                                    )}
                                </div>
                            </React.Fragment>
                        ) : (
                            <Feed.Event>
                                <Feed.Content>
                                    <div className="empty-feed">
                                        <Zap size={35} strokeWidth={2} />
                                        <br />
                                        <span>{this.state.emptyStates[Math.floor(Math.random() * this.state.emptyStates.length)]}</span>
                                    </div>
                                </Feed.Content>
                            </Feed.Event>
                        )}
                    </Feed>
                )}
                {this.state.isLoading && <Loader active>Loading Feed</Loader>}
                <Modal
                    onClose={() => this.setState({ imageModalVisible: false })}
                    onClick={() => this.setState({ imageModalVisible: false })}
                    onOpen={() => this.setState({ imageModalVisible: true })}
                    open={this.state.imageModalVisible}
                    className="image-modal-content"
                >
                    <Modal.Content>
                        <img src={this.state.imageModalUrl} />
                    </Modal.Content>
                </Modal>

                {this.state.reportModalVisible && (
                    <ReportPost
                        handleClose={() => this.setState({ reportModalVisible: false })}
                        handleOpen={() => this.setState({ reportModalVisible: true })}
                        handleSuccessMessage={() => this.setState({ reportSuccessVisible: true })}
                        handleErrorMessage={() => this.setState({ reportErrorVisible: true })}
                        open={this.state.reportModalVisible}
                        postId={this.state.reportModalPostId}
                    />
                )}

                <Modal
                    onClose={() => {
                        this.setState({ reportSuccessVisible: false })
                    }}
                    onOpen={() => this.setState({ reportSuccessVisible: true })}
                    open={this.state.reportSuccessVisible}
                    size="mini"
                >
                    <Modal.Header>Post reported!</Modal.Header>
                    <Modal.Content>Thank you for your feedback about this post. We will review it immediately.</Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="black"
                            onClick={() => {
                                this.setState({ reportSuccessVisible: false })
                            }}
                        >
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal onClose={() => this.setState({ reportErrorVisible: false })} onOpen={() => this.setState({ reportErrorVisible: true })} open={this.state.reportErrorVisible} size="mini">
                    <Modal.Header>Post could not be reported!</Modal.Header>
                    <Modal.Content>Unfortunately, this post could not be reported. Please try again later.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => this.setState({ reportErrorVisible: false })}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default PostsList

PostsList.propTypes = {
    user: PropTypes.string,
}
