import React, { useEffect, useState } from 'react'
import './style.scss'
import { Placeholder, Icon } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams, NavLink } from 'react-router-dom'
import { Hash } from 'react-feather'

const SidebarPopularItems = () => {
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        let popularItems = ''

        fetch(
            // eslint-disable-next-line no-undef
            process.env.REACT_APP_API_URL + '/api/sidebar/popular',
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                setTopics(result)
                setIsLoading(false)
            })
    }, [])

    return (
        <div className="topic-container">
            {isLoading ? (
                <div>
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                </div>
            ) : (
                <>
                    {topics.length == 0 ? (
                        <span className="empty-topics">Sorry. We could not find any topics.</span>
                    ) : (
                        topics.map((topic) => {
                            return (
                                <NavLink key={`topic-${topic.id}`} className={({ isActive }) => (!isActive ? 'topic-item' : 'topic-item topic-item--active')} to={`/app/topic/` + topic.topic}>
                                    <Hash size={18} strokeWidth={2.7} /> {topic.topic}
                                </NavLink>
                            )
                        })
                    )}
                </>
            )}
        </div>
    )
}

export default SidebarPopularItems
