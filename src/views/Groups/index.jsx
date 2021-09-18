/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button } from 'semantic-ui-react';
import { Hash } from 'react-feather'
import unknownAvatar from '../../static/unknown.png'
import unknownBanner from '../../static/banner.jpg'

// Components
import Header from '../../components/Header'

function Groups() {

    const [groupsList, setGroupsList] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [loadingButtons, setLoadingButtons] = useState([]);

    useEffect(() => {
        document.title = 'Loading groups... – WorkGroup'

        var userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/group/getGroups`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setGroupsList(res["groups"])
                    if (res['group_count'] == 1) {
                        document.title = '1 Group found – WorkGroup'
                    } else {
                        document.title = res['group_count'] + ' Groups found – WorkGroup'
                    }
                }
            })
        
        fetch(process.env.REACT_APP_API_URL + `/api/group/getTags`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setTagsList(res)
                }
            })
    }, [])

    const joinGroup = (groupId) => {
        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                id: groupId,
            }),
        }

        fetch(process.env.REACT_APP_API_URL + '/api/group/joinGroup', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == "approved") {
                    window.location.href = '/app/group-request-approved';
                } else {
                    window.location.href = '/app/group-request-pending';
                }
            })
    }

    return (
        <div className="app">
            <Header />
            <div className="main_content">
                <div className="groups-content">
                    <div className="group-topics">
                        {tagsList.length > 0 && (
                            tagsList.map((tag) => {
                                return (
                                    <Link key={tag.id} className="group-topics-item" to={`/app/groups/${tag.id}`}>
                                        <Hash size={18} strokeWidth={2.7} /> {tag.tag}
                                    </Link>
                                )
                            })
                        )}
                    </div>
                    <div className="group-list">

                        {groupsList.length > 0 && (
                            groupsList.map((group) => {
                                return (
                                    <div key={group.id} className="group-list-item">
                                        <img className="group-list-item-banner" src={group.group_banner} onError={(e) => {e.target.src = unknownBanner }} alt="" />
                                        <img className="group-list-item-avatar" src={group.group_avatar} onError={(e) => {e.target.src = unknownAvatar }} alt="" />
    
                                        <div className="group-list-item-content">
                                            <span className="group-list-item-title">{group.group_title} <small className="group-list-item-members">{group.member_count} Member{(group.member_count !== 1) && (<>s</>)}</small></span><br />
                                            <p className="group-list-item-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus non repudiandae nobis debitis corrupti nihil dignissimos quam laborum, nostrum qui illo dicta alias iure facere nam? Odio cupiditate quasi deserunt!</p>
                                            <br />
                                            <Button onClick={(e) => {
                                                joinGroup(group.id);
                                                e.target.classList.add('loading')
                                                e.target.disabled = true;
                                            }} size="small" primary>
                                                Join{(group.group_private == 1) && (<> private</>)} group
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })
                        )}


                    </div>

                </div>
            </div>
        </div>
    );
}

export default Groups;