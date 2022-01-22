/* eslint-disable no-useless-constructor */
import React, { useState, useEffect, useRef } from 'react'
import { List, Loader, Pagination } from 'semantic-ui-react'
import './style.scss'
import unknownAvatar from '../../../static/unknown.png'

import { Monitor, Server, AtSign, BarChart2, Home, Zap } from 'react-feather'

function SettingsUsers() {
    const [isLoading, setIsLoading] = useState(false)
    const [paginationPage, setPaginationPage] = useState(1)
    const [totalPaginationPages, setTotalPagionationPages] = useState(1)
    const [users, setUsers] = useState([])

    useEffect(() => {
        document.title = 'Users – WorkGroup'

        loadUsers(1)
    }, [])

    const loadUsers = (page) => {
        setPaginationPage(page)
        setIsLoading(true)
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/settings/users?page=' + page, requestOptions)
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

    const getDate = (date) => {
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
                                {users.map((member, index) => {
                                    return (
                                        <List key={index} divided relaxed>
                                            <List.Item href={`/app/user/${member.email}`}>
                                                <List.Content>
                                                    <div className="settings_user-avatar">
                                                        <img
                                                            src={process.env.REACT_APP_API_URL + '/' + member.avatar.replace('./', '')}
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.src = unknownAvatar
                                                            }}
                                                        />
                                                    </div>
                                                    <List.Header as="a">{member.name}</List.Header>
                                                    <List.Description as="a">{getDate(member.created_at)}</List.Description>
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
        </>
    )
}

export default SettingsUsers
