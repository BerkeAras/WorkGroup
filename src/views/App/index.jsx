/* eslint-disable no-useless-constructor */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input } from 'semantic-ui-react'
import logo from '../../static/logo.svg'

// Components
import SidebarLeft from '../../components/SidebarLeft'
import SidebarRight from '../../components/SidebarRight'
import Header from '../../components/Header'
import Content from '../../components/Content'

import CreatePostForm from '../../components/_App_CreatePostForm'
import PostsList from '../../components/_App_PostsList'

const MainApp = () => {
    useEffect(() => {
        document.title = 'Feed - WorkGroup'
    }, [])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content">
                <SidebarLeft />
                <Content>
                    <CreatePostForm />
                    <PostsList user="*" />
                </Content>
                <SidebarRight />
            </div>
        </div>
    )
}

export default MainApp
