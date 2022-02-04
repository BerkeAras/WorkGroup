/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import './style.scss'

import { Monitor, Server, AtSign, BarChart2, Home, Users } from 'react-feather'

// Components
import Header from '../../components/Header/Header'
import SettingsHome from './Home'
import SettingsUsers from './Users'
import SettingsFrontend from './Frontend'
import SettingsServer from './Server'
import SettingsMail from './Mail'
import SettingsAnalytics from './Analytics'

function Settings() {
    let { category } = useParams()

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content">
                <div className="settings_sidebar">
                    <NavLink key="settings-home" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/overview">
                        <Home size={18} strokeWidth={2.7} /> Home
                    </NavLink>
                    <NavLink key="settings-users" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/users">
                        <Users size={18} strokeWidth={2.7} /> Users
                    </NavLink>
                    <NavLink key="settings-app" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/app">
                        <Monitor size={18} strokeWidth={2.7} /> Frontend
                    </NavLink>
                    <NavLink key="settings-server" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/server">
                        <Server size={18} strokeWidth={2.7} /> Server
                    </NavLink>
                    <NavLink key="settings-mail" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/mail">
                        <AtSign size={18} strokeWidth={2.7} /> Mail
                    </NavLink>
                    <NavLink key="settings-analytics" className="settings_sidebar-item" activeClassName="settings_sidebar-item--active" to="/app/settings/analytics">
                        <BarChart2 size={18} strokeWidth={2.7} /> Analytics
                    </NavLink>
                </div>
                {category == undefined ? (
                    <SettingsHome />
                ) : category == 'overview' ? (
                    <SettingsHome />
                ) : category == 'users' ? (
                    <SettingsUsers />
                ) : category == 'app' ? (
                    <SettingsFrontend />
                ) : category == 'server' ? (
                    <SettingsServer />
                ) : category == 'mail' ? (
                    <SettingsMail />
                ) : category == 'analytics' ? (
                    <SettingsAnalytics />
                ) : (
                    <SettingsFrontend />
                )}
            </div>
        </div>
    )
}

export default Settings
