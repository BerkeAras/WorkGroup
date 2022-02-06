import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'

import SidebarLeft from '../../components/Sidebar/SidebarLeft'
import SidebarRight from '../../components/Sidebar/SidebarRight'
import Header from '../../components/Header/Header'
import Content from '../../components/Content'

import PostsList from '../../components/Feed/FeedPostsList'

export default function Topic() {
    let { hashTag } = useParams()

    useEffect(() => {
        document.title = 'Topic #' + hashTag + ' – WorkGroup'
    }, [hashTag])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content topic-page">
                <SidebarLeft />
                <Content>
                    <PostsList hashTag={hashTag} />
                </Content>
                <SidebarRight />
            </div>
        </div>
    )
}
