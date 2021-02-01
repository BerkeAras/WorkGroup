/* eslint-disable no-useless-constructor */
import React, { useState } from 'react'
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

class MainApp extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {}

    render() {
        return (
            <div className="app">
                <Header />
                <div className="main_content">
                    <SidebarLeft />
                    <Content>
                        <CreatePostForm />
                    </Content>
                    <SidebarRight />
                </div>
            </div>
        )
    }
}
export default MainApp
