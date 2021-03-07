import React, { useRef } from 'react'
import './style.scss'
import { Feed, Icon, Card, Loader, Button } from 'semantic-ui-react'
import InfiniteScroll from 'react-infinite-scroll-component'

import unknownAvatar from '../../static/unknown.png'

class PostsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoading: true,
            cursor: 1,
            loaded: false,
            isLoadingMore: false,
            emptyStates: ["It's empty here. Start sharing something about your thoughts!", 'Your friends are shy. Get started and write your first post.'],
        }
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
                        console.error('ERROR: ' + res['message'])
                        //localStorage.clear()
                        //location.href = '/?error_happened'
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
            let currentHours = todaysDate.getHours()
            currentHours = ('0' + currentHours).slice(-2)

            dateString = 'Today, ' + currentHours + ':' + (todaysDate.getMinutes() < 10 ? '0' : '') + todaysDate.getMinutes()
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

    toggleLike(e) {
        e.preventDefault()
        let element

        if (e.target.tagName === 'I') {
            element = e.target.parentNode
        } else {
            element = e.target
        }

        element.parentNode.style.pointerEvents = 'none'

        let postId = element.parentNode.id
        postId = postId.replace('post_id_', '')

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

        let likeCount = parseInt(element.textContent.substr(0, element.textContent.indexOf(' ')))

        fetch(process.env.REACT_APP_API_URL + '/api/content/likePost', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                if (result === 'unliked') {
                    likeCount = likeCount - 1

                    element.parentNode.classList.remove('liked')

                    if (likeCount == 1) {
                        element.textContent = '1 Like'
                    } else {
                        element.textContent = likeCount + ' Likes'
                    }
                } else {
                    likeCount = likeCount + 1

                    element.parentNode.classList.add('liked')

                    if (likeCount == 1) {
                        element.textContent = '1 Like'
                    } else {
                        element.textContent = likeCount + ' Likes'
                    }
                }

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
                                    <Feed.Event key={item.id}>
                                        <Feed.Label>{item.avatar == '' ? <img src={unknownAvatar} /> : <img src={process.env.REACT_APP_API_URL + '/static/' + item.avatar} />}</Feed.Label>
                                        <Feed.Content>
                                            <Feed.Summary>
                                                <Feed.User>{item.name}</Feed.User>
                                                <Feed.Date>{this.getDate(item.created_at)}</Feed.Date>
                                            </Feed.Summary>
                                            <Feed.Extra text>
                                                <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                            </Feed.Extra>
                                            <Feed.Meta>
                                                <Feed.Like onClick={this.toggleLike} id={'post_id_' + item.id} className={item.hasLiked}>
                                                    <Icon name="like" />
                                                    <span>{this.getLikes(item.likes)}</span>
                                                </Feed.Like>
                                            </Feed.Meta>
                                        </Feed.Content>
                                    </Feed.Event>
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
