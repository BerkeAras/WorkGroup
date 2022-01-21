import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { DebounceInput } from 'react-debounce-input'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUsers, faCalendarDay, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { User, Search, Hash, Users, Zap, AlertTriangle } from 'react-feather'
library.add(faUsers)
library.add(faCalendarDay)
library.add(faHashtag)

import './style.scss'

const SearchField = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [userResult, setUserResult] = useState([])
    const [groupResult, setGroupResult] = useState([])
    const [topicResult, setTopicResult] = useState([])
    const [popularTopics, setPopularTopics] = useState([])
    const [isLoadingResults, setIsLoadingResults] = useState(false)

    useEffect(() => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        let requestOptions = {
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
            setGroupResult([])
            setTopicResult([])
            setIsLoadingResults(false)
        } else {
            controller.abort()
            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let requestOptions = {
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
                    let groupResult = result[1]
                    let topicResult = result[2]

                    setUserResult(userResult)
                    setGroupResult(groupResult)
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
        <>
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
                            <>
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
                            </>
                        )}
                        {groupResult.length > 0 && (
                            <>
                                <span className="divider">Groups</span>
                                {groupResult.map((group) => {
                                    return (
                                        <li key={group.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/group/' + group.id}>
                                                <Users size={20} strokeWidth={2.7} /> {group.group_title}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        )}
                        {topicResult.length > 0 && (
                            <>
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
                            </>
                        )}

                        {userResult.length == 0 && groupResult.length == 0 && topicResult.length == 0 && searchQuery.length >= 3 && (
                            <center className="search-error">
                                <AlertTriangle size={35} strokeWidth={2} />
                                <br />
                                <span>No Search Results found!</span>
                            </center>
                        )}
                        {userResult.length == 0 && groupResult.length == 0 && topicResult.length == 0 && searchQuery.length < 3 && (
                            <center className="search-error">
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>Search for colleagues, groups, events and more...</span>
                            </center>
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
        </>
    )
}

export default SearchField
