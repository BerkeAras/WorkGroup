import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { DebounceInput } from 'react-debounce-input'
import ConfigContext from '../../../store/ConfigContext'

// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUsers, faCalendarDay, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { User, Search, Hash, Users, Zap, AlertTriangle, Folder, FileText, BookOpen } from 'react-feather'
library.add(faUsers)
library.add(faCalendarDay)
library.add(faHashtag)

import './style.scss'

const SearchField = () => {
    const contextValue = useContext(ConfigContext)
    const [searchQuery, setSearchQuery] = useState('')
    const [userResult, setUserResult] = useState([])
    const [groupResult, setGroupResult] = useState([])
    const [topicResult, setTopicResult] = useState([])
    const [knowledgeBaseFoldersResult, setKnowledgeBaseFoldersResult] = useState([])
    const [knowledgeBaseFilesResult, setKnowledgeBaseFilesResult] = useState([])
    const [postsResult, setPostsResult] = useState([])
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [minimumSearchLength, setMinimumSearchLength] = useState(3)

    useEffect(() => {
        if (contextValue != undefined) {
            let minimumSearchLengthContext = contextValue.app.minimum_search_length
            minimumSearchLengthContext = Number.parseInt(minimumSearchLengthContext)

            setMinimumSearchLength(minimumSearchLengthContext)
        }
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

        if (inputValue == '' || inputValue.length < minimumSearchLength) {
            setUserResult([])
            setGroupResult([])
            setTopicResult([])
            setKnowledgeBaseFoldersResult([])
            setKnowledgeBaseFilesResult([])
            setPostsResult([])
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
                    let groupResult = Object.values(result[1])
                    let topicResult = result[2]
                    let knowledgeBaseFolders = result[3]
                    let knowledgeBaseFiles = result[4]
                    let postResult = result[5]

                    setUserResult(userResult)
                    setGroupResult(groupResult)
                    setTopicResult(topicResult)
                    setKnowledgeBaseFoldersResult(knowledgeBaseFolders)
                    setKnowledgeBaseFilesResult(knowledgeBaseFiles)
                    setPostsResult(Object.keys(postResult).map((key) => postResult[key]))

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
                        minLength={minimumSearchLength}
                        debounceTimeout={500}
                        value={searchQuery}
                        onFocus={searchFieldFocus}
                        onChange={searchQueryChangeHandler}
                        placeholder="Search for colleagues, groups, files and more..."
                    />
                    {isLoadingResults && <span className="loader"></span>}
                </form>

                <div className="SearchField-Results" tabIndex="-1">
                    <ul>
                        {userResult && userResult.length > 0 && (
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
                        {groupResult && groupResult.length > 0 && (
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
                        {topicResult && topicResult.length > 0 && (
                            <>
                                <span className="divider">Popular topics</span>
                                {topicResult.map((topic) => {
                                    return (
                                        <li key={topic.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/topic/' + topic.topic}>
                                                <Hash size={18} strokeWidth={2.7} /> {topic.topic}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        )}
                        {knowledgeBaseFoldersResult && knowledgeBaseFoldersResult.length > 0 && (
                            <>
                                <span className="divider">Folders</span>
                                {knowledgeBaseFoldersResult.map((knowledgeBaseFoldersResult) => {
                                    return (
                                        <li key={knowledgeBaseFoldersResult.id}>
                                            <Link onClick={() => document.activeElement.blur()} to={'/app/knowledgebase/' + knowledgeBaseFoldersResult.id}>
                                                <Folder size={18} strokeWidth={2.7} /> {knowledgeBaseFoldersResult.knowledge_base_folder_name}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        )}
                        {knowledgeBaseFilesResult && knowledgeBaseFilesResult.length > 0 && (
                            <>
                                <span className="divider">Files</span>
                                {knowledgeBaseFilesResult.map((knowledgeBaseFilesResult) => {
                                    return (
                                        <li key={knowledgeBaseFilesResult.id}>
                                            <Link
                                                onClick={() => document.activeElement.blur()}
                                                to={'/app/knowledgebase/' + knowledgeBaseFilesResult.knowledge_base_file_folder_id + '/' + knowledgeBaseFilesResult.id}
                                            >
                                                <FileText size={18} strokeWidth={2.7} /> {knowledgeBaseFilesResult.knowledge_base_file_name}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        )}
                        {(postsResult && postsResult.length > 0) && (
                            <>
                                <span className="divider">Posts</span>
                                {postsResult.map((postResult) => {
                                    return (
                                        <li key={postResult.id}>
                                            <Link
                                                onClick={() => document.activeElement.blur()}
                                                to={'/app/post/' + postResult.id}
                                            >
                                                <BookOpen size={18} strokeWidth={2.7} /> {postResult.post_content}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        )}

                        {userResult &&
                            groupResult &&
                            topicResult &&
                            searchQuery &&
                            userResult.length == 0 &&
                            groupResult.length == 0 &&
                            topicResult.length == 0 &&
                            knowledgeBaseFoldersResult.length == 0 &&
                            knowledgeBaseFilesResult.length == 0 &&
                            postsResult.length == 0 &&
                            searchQuery.length >= minimumSearchLength && (
                                <center className="search-error">
                                    <AlertTriangle size={35} strokeWidth={2} />
                                    <br />
                                    <span>No Search Results found!</span>
                                </center>
                            )}

                        {((userResult.length == 0 &&
                            groupResult.length == 0 &&
                            topicResult.length == 0 &&
                            knowledgeBaseFoldersResult.length == 0 &&
                            knowledgeBaseFilesResult.length == 0 &&
                            postsResult.length == 0 &&
                            searchQuery.length < minimumSearchLength) ||
                            searchQuery.length == 0) && (
                            <center className="search-error">
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>Search for colleagues, groups, files and more...</span>
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
