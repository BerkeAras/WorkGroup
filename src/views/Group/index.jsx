/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { User as UserIcon, Info } from 'react-feather'

// Components
import Header from '../../components/Header/Header'
import CreatePostForm from '../../components/Feed/FeedCreatePostForm'
import PostsList from '../../components/Feed/FeedPostsList'

import GroupBanner from '../../components/Group/GroupBanner'

function Group() {
    let { id } = useParams()
    const [groupInformation, setGroupInformation] = useState([])

    useEffect(() => {
        document.title = 'Loading group... – WorkGroup'

        let userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        let requestOptions = {
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
            <div id="main_content" className="main_content">
                <GroupBanner groupInformation={groupInformation}></GroupBanner>
                <div className="group-content">
                    <div className="group-information">
                        <span className="group-information-item">
                            <UserIcon size={20} strokeWidth={2.5} /> Members: {groupInformation['member_count']}
                        </span>
                        {groupInformation['group_description'] !== '' && (
                            <span className="group-information-item">
                                <Info size={20} strokeWidth={2.5} /> {groupInformation['group_description']}
                            </span>
                        )}
                    </div>
                    <div className="group-feed">
                        {groupInformation['is_group_member'] == true && <CreatePostForm group={id} />}
                        <PostsList group={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Group
