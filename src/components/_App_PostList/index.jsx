import React, { useEffect, useState } from 'react'
import './style.scss'
import { Feed, Icon, Loader, Button } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { ThumbsUp, MessageCircle, Zap } from 'react-feather'
import PropTypes from 'prop-types'

import unknownAvatar from '../../static/unknown.png'

import CommentSection from '../_App_CommentSection/'

function PostList(props) {
    const user = props.user
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [cursor, setCursor] = useState(1)
    const [loaded, setLoaded] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [visibleCommentSections, setVisibleCommentSections] = useState([])
    const [emptyStates, setEmptyStates] = useState(["It's empty here. Start sharing something about your thoughts!", 'Your friends are shy. Get started and write your first post.'])

    useEffect(() => {
        setCursor(1)

        console.log(props.user)

        if (props.user !== undefined) {
            loadMore(props.user)
        }
    }, [props.user])

    const convertDate = (date) => {
        var t,
            result = null

        if (typeof mysql_string === 'string') {
            t = date.split(/[- :]/)

            //when t[3], t[4] and t[5] are missing they defaults to zero
            result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0)
        }

        return result
    }

    const getFriendlyDate = (date) => {
        var unfriendlyDate = Math.round((+new Date() - date) / 1000)

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7

        var friendlyDate

        if (unfriendlyDate < 30) {
            friendlyDate = 'just then.'
        } else if (unfriendlyDate < minute) {
            friendlyDate = unfriendlyDate + ' seconds ago.'
        } else if (unfriendlyDate < 2 * minute) {
            friendlyDate = 'a minute ago.'
        } else if (unfriendlyDate < hour) {
            friendlyDate = Math.floor(unfriendlyDate / minute) + ' minutes ago.'
        } else if (Math.floor(unfriendlyDate / hour) == 1) {
            friendlyDate = '1 hour ago.'
        } else if (unfriendlyDate < day) {
            friendlyDate = Math.floor(unfriendlyDate / hour) + ' hours ago.'
        } else if (unfriendlyDate < day * 2) {
            friendlyDate = 'yesterday'
        }

        return friendlyDate
    }

    const loadMore = (userFeed) => {
        setIsLoadingMore(true)

        var loadingHeader = new Headers()
        loadingHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: loadingHeader,
            redirect: 'follow',
        }

        if (userFeed == '*') {
            userFeed = ''
        } else {
            userFeed = `&user=${userFeed}`
        }

        setIsLoading(true)
        fetch(process.env.REACT_APP_API_URL + `/api/content/getPosts?from=${cursor}` + userFeed, requestOptions)
            .then((res) => res.json())
            .then(
                (res) => {
                    setIsLoadingMore(false)
                    if (res['status_code'] !== undefined) {
                        if (res['message'] === 'Token has expired') {
                            location.href = '/logout'
                            localStorage.clear()
                        }
                    } else {
                        if (items.length > 60) {
                            setItems([])
                        }

                        setItems([...items, ...res])
                        setCursor(cursor + 1)
                        setIsLoading(false)
                        setLoaded(true)
                    }
                },
                (error) => {
                    setIsLoading(false)
                }
            )
    }

    const getDate = (date) => {
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

    const getLikes = (likes) => {
        let returnStr = '0 Likes'

        if (likes == 1) {
            returnStr = '1 Like'
        } else {
            returnStr = likes + ' Likes'
        }

        return returnStr
    }

    const getComments = (comments) => {
        let returnStr = '0 Comments'

        if (comments == 1) {
            returnStr = '1 Comment'
        } else {
            returnStr = comments + ' Comments'
        }

        return returnStr
    }

    const toggleComment = (e) => {
        setIsLoadingMore(true)

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

        let isVisible = visibleCommentSections.includes(val)

        let newStatus

        setTimeout(() => {
            if (!isVisible) {
                newStatus = true

                // Add item to it
                let updatedVisibleCommentSections = visibleCommentSections
                updatedVisibleCommentSections.push(val)

                // Set state
                setVisibleCommentSections(updatedVisibleCommentSections)
            } else {
                newStatus = false

                let updatedVisibleCommentSections = visibleCommentSections
                updatedVisibleCommentSections.remove(val)

                setVisibleCommentSections(updatedVisibleCommentSections)
            }
            setIsLoadingMore(false)
        }, 1)
    }

    const toggleLike = (e) => {
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

    return (
        <div>
            {loaded === true && user !== undefined && (
                <Feed>
                    {visibleCommentSections}
                    {items.length > 0 ? (
                        <React.Fragment>
                            {items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <Feed.Event>
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
                                                <Feed.Date>{getDate(item.created_at)}</Feed.Date>
                                            </Feed.Summary>
                                            <Feed.Extra text>
                                                <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                            </Feed.Extra>
                                            <Feed.Meta>
                                                <Feed.Like href="#" onClick={toggleLike} id={'post_like_id_' + item.id} className={item.hasLiked}>
                                                    <ThumbsUp size={16} strokeWidth={2.5} />
                                                    <span>{getLikes(item.likes)}</span>
                                                </Feed.Like>
                                                <a href="#" className="comment-button" onClick={(e) => toggleComment(e)} id={'post_comment_id_' + item.id}>
                                                    <MessageCircle size={16} strokeWidth={2.5} />
                                                    <span>{getComments(item.comments)}</span>
                                                </a>
                                            </Feed.Meta>
                                        </Feed.Content>
                                    </Feed.Event>
                                    {visibleCommentSections.includes(item.id) > 0 && <CommentSection postId={item.id.toString()} />}
                                </React.Fragment>
                            ))}

                            <div className="load-more-container">
                                {isLoadingMore === true ? (
                                    <Button loading primary>
                                        Load more
                                    </Button>
                                ) : (
                                    <Button primary onClick={loadMore}>
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
                                    <span>{emptyStates[Math.floor(Math.random() * emptyStates.length)]}</span>
                                </div>
                            </Feed.Content>
                        </Feed.Event>
                    )}
                </Feed>
            )}
            {isLoading && <Loader active>Loading Feed</Loader>}
        </div>
    )
}

export default PostList

PostList.propTypes = {
    user: PropTypes.any,
}
