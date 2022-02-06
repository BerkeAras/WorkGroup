import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'

import SidebarLeft from '../../components/Sidebar/SidebarLeft'
import SidebarRight from '../../components/Sidebar/SidebarRight'
import Header from '../../components/Header/Header'
import Content from '../../components/Content'

import PostsList from '../../components/Feed/FeedPostsList'

export default function SinglePost() {
    let { postId } = useParams()

    useEffect(() => {
        document.title = 'Feed – WorkGroup'
    }, [postId])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content single-post-page">
                <SidebarLeft />
                <Content>
                    <PostsList postId={postId} />
                </Content>
                <SidebarRight />
            </div>
        </div>
    )
}
