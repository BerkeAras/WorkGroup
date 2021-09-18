/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { User as UserIcon } from 'react-feather'

// Components
import Header from '../../components/Header'
import CreatePostForm from '../../components/_App_CreatePostForm'
import PostsList from '../../components/_App_PostsList'

import GroupBanner from '../../components/_Group_GroupBanner'

function Group() {
    let { id } = useParams()
    const [groupInformation, setGroupInformation] = useState([])

    useEffect(() => {
        document.title = 'Loading group... – WorkGroup'

        var userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        var requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }
        fetch(process.env.REACT_APP_API_URL + `/api/group/getGroupInformation?id=${id}`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setGroupInformation(res)
                    document.title = res['group_title'] + ' – WorkGroup'
                }
            })
    }, [id])

    return (
        <div className="app">
            <Header />
            <div className="main_content">
                <GroupBanner groupInformation={groupInformation}></GroupBanner>
                <div className="group-content">
                    <div className="group-information">
                        <span className="group-information-item">
                            <UserIcon size={20} strokeWidth={2.5} /> Members: {groupInformation['member_count']}
                        </span>
                    </div>
                    <div className="group-feed">
                        {groupInformation["is_group_member"] == true && (
                            <CreatePostForm group={id} />
                        )}
                        <PostsList group={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Group;