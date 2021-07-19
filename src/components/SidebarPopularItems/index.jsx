import React, { useEffect, useState } from 'react'
import './style.scss'
import { Placeholder, Icon } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import { Hash } from 'react-feather'

const SidebarPopularItems = () => {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        var tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
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
                setTopics(result);
                setIsLoading(false);
            })
            .catch((error) => console.log('error', error))
    }, []);

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
                                <Link key={`topic-${topic.id}`} className="topic-item" to={`/app/topics/` + topic.topic}>
                                    <Hash size={18} strokeWidth={2.7} /> {topic.topic}
                                </Link>
                            )
                        })
                    )}
                </>
            )}
        </div>
    )
}

export default SidebarPopularItems
