import React, { useRef } from 'react'
import './style.scss'
import { Feed, Icon, Card, Loader } from 'semantic-ui-react'
import { InfiniteScroll } from 'react-simple-infinite-scroll'

class PostsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            isLoading: true,
            cursor: 0,
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
        console.log('Loading More...')

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
                    if (res['status_code'] !== undefined) {
                        console.error('ERROR: ' + res['message'])
                        localStorage.clear()
                        location.href = '/?error_happened'
                    } else {
                        this.setState((state) => ({
                            items: [...state.items, ...res],
                            cursor: this.state.cursor + 1,
                            isLoading: false,
                        }))
                    }
                },
                (error) => {
                    this.setState({ isLoading: false, error })
                }
            )
    }

    render() {
        return (
            <div>
                <InfiniteScroll className="infinite-scroll" throttle={100} threshold={100} isLoading={this.state.isLoading} hasMore={true} onLoadMore={this.loadMore}>
                    <Feed>
                        {this.state.items.length > 0
                            ? this.state.items.map((item) => (
                                  <Feed.Event key={item.id}>
                                      <Feed.Label>
                                          <img src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
                                      </Feed.Label>
                                      <Feed.Content>
                                          <Feed.Summary>
                                              <Feed.User>{item.name}</Feed.User>
                                              <Feed.Date>{item.created_at}</Feed.Date>
                                          </Feed.Summary>
                                          <Feed.Extra text>
                                              <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                          </Feed.Extra>
                                          <Feed.Meta>
                                              <Feed.Like>
                                                  <Icon name="like" />4 Likes
                                              </Feed.Like>
                                          </Feed.Meta>
                                      </Feed.Content>
                                  </Feed.Event>
                              ))
                            : null}
                    </Feed>
                </InfiniteScroll>
                {this.state.isLoading && <Loader active>Loading Feed</Loader>}
            </div>
        )
    }
}

export default PostsList
