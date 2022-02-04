/* eslint-disable no-useless-constructor */
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { List, Loader, Pagination, Dropdown, Icon } from 'semantic-ui-react'
import './style.scss'
import unknownAvatar from '../../../static/unknown.png'

import { Eye, Zap, Settings, Info } from 'react-feather'
import UserInformation from '../../../components/Settings/SettingsUserInformation'
import UserSettings from '../../../components/Settings/SettingsUserSettings'

const sortByOptions = [
    { key: 'created-at-desc', text: 'Registration (latest)', value: 'created-at-desc' },
    { key: 'created-at-asc', text: 'Registration (oldest first)', value: 'created-at-asc' },
    { key: 'online-desc', text: 'Online status (online first)', value: 'online-desc' },
    { key: 'online-asc', text: 'Online status (offline first)', value: 'online-asc' },
    { key: 'admin-desc', text: 'Administrator status (admins first)', value: 'admin-desc' },
    { key: 'admin-asc', text: 'Administrator status (non-admins first)', value: 'admin-asc' },
]
function SettingsUsers() {
    const [isLoading, setIsLoading] = useState(false)
    const [paginationPage, setPaginationPage] = useState(1)
    const [totalPaginationPages, setTotalPagionationPages] = useState(1)
    const [users, setUsers] = useState([])
    const [selectedMember, setSelectedMember] = useState(null)
    const [showInformationModal, setShowInformationModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [userOrder, setUserOrder] = useState('created-at-desc')

    useEffect(() => {
        document.title = 'Users – Settings – WorkGroup'

        loadUsers(1)
    }, [])

    const loadUsers = (page, order = 'created-at-desc') => {
        setPaginationPage(page)
        setIsLoading(true)
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/settings/users?orderBy=' + order + '&page=' + page, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)
                setTotalPagionationPages(result.total_pages)
                setUsers(result.users)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handlePaginationChange = (event) => {
        loadUsers(Number.parseInt(event.target.getAttribute('value')))
    }

    const handleDropdownChange = (value) => {
        setPaginationPage(1)
        setUserOrder(value)
        loadUsers(1, value)
    }

    const getDate = (date) => {
        if (date !== null) {
            date = date.replace(/-/g, '/')
        }
        let newDate = new Date(date)

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

        let todaysDate = new Date()

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

    const showUserInformation = (member) => {
        setShowInformationModal(true)
        setSelectedMember(member)
    }

    const showUserSettings = (member) => {
        setShowSettingsModal(true)
        setSelectedMember(member)
    }

    return (
        <>
            <div className="settings_content">
                {isLoading ? (
                    <center className="settings_content_loader">
                        <Loader active>Loading Users...</Loader>
                    </center>
                ) : (
                    <>
                        {users ? (
                            <>
                                <Dropdown
                                    options={sortByOptions}
                                    value={userOrder}
                                    onChange={(e, { value }) => {
                                        handleDropdownChange(value)
                                    }}
                                    placeholder="Sort by"
                                />
                                {users.map((member, index) => {
                                    return (
                                        <List key={index} divided relaxed>
                                            <List.Item>
                                                <List.Content floated="right">
                                                    <Link to={`/app/user/${member.email}`}>
                                                        <button className="settings_user-button">
                                                            <Eye size={24} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            showUserSettings(member)
                                                        }}
                                                        className="settings_user-button"
                                                    >
                                                        <Settings size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            showUserInformation(member)
                                                        }}
                                                        className="settings_user-button"
                                                    >
                                                        <Info size={24} />
                                                    </button>
                                                </List.Content>
                                                <List.Content>
                                                    <div className="settings_user-avatar">
                                                        <img
                                                            src={process.env.REACT_APP_API_URL + '/' + member.avatar.replace('./', '')}
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.src = unknownAvatar
                                                            }}
                                                        />
                                                        {member.is_admin ? <Icon className="settings_user-admin" name="shield" size="large" /> : null}
                                                        {member.user_online ? <div className="settings_user-online"></div> : null}
                                                    </div>
                                                    <List.Header>
                                                        {member.name} <i>#{member.id}</i>
                                                    </List.Header>
                                                    <List.Description>{getDate(member.created_at)}</List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    )
                                })}
                                <Pagination onPageChange={(event) => handlePaginationChange(event)} activePage={paginationPage} totalPages={totalPaginationPages} />
                            </>
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>There are no Members in this group.</span>
                            </center>
                        )}
                        <br />
                    </>
                )}
            </div>

            <UserInformation member={selectedMember} isOpenState={showInformationModal} isOpenStateController={setShowInformationModal} />
            <UserSettings member={selectedMember} isOpenState={showSettingsModal} isOpenStateController={setShowSettingsModal} />
        </>
    )
}

export default SettingsUsers
