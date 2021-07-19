import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { DebounceInput } from 'react-debounce-input'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUsers, faCalendarDay, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { User, Search, Hash } from 'react-feather'
library.add(faUsers)
library.add(faCalendarDay)
library.add(faHashtag)

import './style.scss'

const SearchField = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [userResult, setUserResult] = useState([])
    const [topicResult, setTopicResult] = useState([])
    const [popularTopics, setPopularTopics] = useState([])
    const [isLoadingResults, setIsLoadingResults] = useState(false)

    useEffect(() => {
        var tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        var requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/sidebar/popular', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setPopularTopics(result)
            })
    }, [])

    const showMobileSearch = (event) => {
        event.preventDefault()
        document.querySelector('.SearchField').classList.add('SearchField-mobile-visible')
        document.querySelector('.SearchField input').focus()
    }

    const searchQueryChangeHandler = () => {
        let inputValue = document.querySelector('.SearchField input').value.trim()
        setSearchQuery(inputValue)
        const controller = new AbortController()
        const { signal } = controller

        if (inputValue == '' || inputValue.length < 3) {
            setUserResult([])
            setTopicResult([])
            setIsLoadingResults(false)
        } else {
            controller.abort()
            var tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            var requestOptions = {
                method: 'GET',
                headers: tokenHeaders,
                redirect: 'follow',
            }

            let popularItems = ''

            setIsLoadingResults(true)

            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/search?query=' + encodeURIComponent(inputValue), requestOptions, { signal })
                .then((response) => response.json())
                .then((result) => {
                    let userResult = result[0]
                    let topicResult = result[1]

                    setUserResult(userResult)
                    setTopicResult(topicResult)

                    setIsLoadingResults(false)
                })
        }
    }

    const searchFieldFocus = () => {
        document.querySelector('.SearchFieldBackdrop').classList.add('SearchFieldBackdrop-visible')
        document.querySelector('.SearchField-Results').classList.add('SearchField-Results-visible')
        document.querySelector('.SearchField').classList.add('SearchField-expanded')
    }
    const searchFieldFocusOut = (force = false) => {
        if (!document.querySelector('.SearchField-mobile-visible') || force == true) {
            setTimeout(function () {
                if (document.querySelector('.SearchField').contains(document.activeElement) == false) {
                    document.querySelector('.SearchFieldBackdrop').classList.remove('SearchFieldBackdrop-visible')
                    document.querySelector('.SearchField-Results').classList.remove('SearchField-Results-visible')
                    document.querySelector('.SearchField').classList.remove('SearchField-expanded')
                    document.querySelector('.SearchField').classList.remove('SearchField-mobile-visible')
                } else {
                    searchFieldFocus()
                }
            }, 10)
        }
    }

    return (
        <React.Fragment>
            <div className="SearchField" onBlur={searchFieldFocusOut}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        searchQueryChangeHandler()
                    }}
                >
                    <DebounceInput
                        minLength={3}
                        debounceTimeout={500}
                        value={searchQuery}
                        onFocus={searchFieldFocus}
                        onChange={searchQueryChangeHandler}
                        placeholder="Search for colleagues, groups, events and more..."
                    />
                    {isLoadingResults && <span className="loader"></span>}
                </form>

                <div className="SearchField-Results" tabIndex="-1">
                    <ul>
                        {userResult.length > 0 && (
                            <React.Fragment>
                                <span className="divider">Users</span>
                                {userResult.map((user) => {
                                    return (
                                        <li key={user.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/user/' + user.email}>
                                                <User size={20} strokeWidth={2.7} /> {user.name}{' '}
                                                {(user.user_department !== null || user.user_department !== '') && <small>{user.user_department}</small>}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </React.Fragment>
                        )}
                        {topicResult.length > 0 ? (
                            <React.Fragment>
                                <span className="divider">Popular topics</span>
                                {topicResult.map((topic) => {
                                    return (
                                        <li key={topic.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/topics/' + topic.topic}>
                                                <Hash size={18} strokeWidth={2.7} /> {topic.topic}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <span className="divider">Popular topics</span>
                                {popularTopics.map((topic) => {
                                    return (
                                        <li key={topic.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/topics/' + topic.topic}>
                                                <Hash size={18} strokeWidth={2.7} /> {topic.topic}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            </div>
            <a href="#" onClick={showMobileSearch} className="header__dropdown-button header__dropdown-button-search">
                <Search></Search>
            </a>
            <div
                className="SearchFieldBackdrop"
                onClick={(event) => {
                    searchFieldFocusOut(true)
                }}
            ></div>
        </React.Fragment>
    )
}

export default SearchField
