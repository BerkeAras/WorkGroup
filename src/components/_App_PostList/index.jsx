import React, { useRef } from 'react'
import './style.scss'
import { Feed, Icon, Header, Loader, Button, Comment, Form } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'

import unknownAvatar from '../../static/unknown.png'

import CommentSection from '../_App_CommentSection/'

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
        }

        this.toggleComment = this.toggleComment.bind(this)
    }

    componentDidMount() {
        this.loadMore()
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

        this.setState({ isLoading: true, error: undefined })
        fetch(process.env.REACT_APP_API_URL + `/api/content/getPosts?from=${this.state.cursor}`, requestOptions)
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

    render() {
        return (
            <div>
                {this.state.loaded === true && (
                    <Feed>
                        {this.state.items.length > 0 ? (
                            <React.Fragment>
                                {this.state.items.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <Feed.Event>
                                            <Feed.Label className="user-avatar" href={'/user/' + item.email}>
                                                {item.avatar == '' ? <img src={unknownAvatar} /> : <img src={process.env.REACT_APP_API_URL + '/static/' + item.avatar} />}
                                            </Feed.Label>
                                            <Feed.Content>
                                                <Feed.Summary>
                                                    <Feed.User href={'/user/' + item.email}>{item.name}</Feed.User>
                                                    <Feed.Date>{this.getDate(item.created_at)}</Feed.Date>
                                                </Feed.Summary>
                                                <Feed.Extra text>
                                                    <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                                </Feed.Extra>
                                                <Feed.Meta>
                                                    <Feed.Like href="#" onClick={this.toggleLike} id={'post_like_id_' + item.id} className={item.hasLiked}>
                                                        <Icon name="like" />
                                                        <span>{this.getLikes(item.likes)}</span>
                                                    </Feed.Like>
                                                    <a href="#" className="comment-button" onClick={this.toggleComment} id={'post_comment_id_' + item.id}>
                                                        <Icon name="comment" />
                                                        <span>{this.getComments(item.comments)}</span>
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
                                        <Icon name="lightning" size="big" />
                                        <br />
                                        <span>{this.state.emptyStates[Math.floor(Math.random() * this.state.emptyStates.length)]}</span>
                                    </div>
                                </Feed.Content>
                            </Feed.Event>
                        )}
                    </Feed>
                )}
                {this.state.isLoading && <Loader active>Loading Feed</Loader>}
            </div>
        )
    }
}

export default PostsList
