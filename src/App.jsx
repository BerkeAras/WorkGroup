import React, { Component } from 'react'
import './scss/style.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'

import SignIn from './views/auth/SignIn'
import ActivateAccount from './views/auth/ActivateAccount'
import PasswordReset from './views/auth/PasswordReset'
import LogOut from './views/auth/LogOut'
import MainApp from './views/App'
import User from './views/User'
import Group from './views/Group'
import Groups from './views/Groups'
import GroupRequestApproved from './views/GroupRequestApproved'
import GroupRequestPending from './views/GroupRequestPending'
import GroupRequestUpdate from './views/GroupRequestUpdate'
import Settings from './views/Settings'
import SinglePost from './views/SinglePost'
import KnowledgeBase from './views/KnowledgeBase'
import SignUpWrapper from './views/auth/SignUp'
import Topic from './views/Topic'
import Error404 from './views/Error404'

import FirstLogin from './components/User/UserFirstLogin'
import CookieBanner from './components/App/AppCookieBanner'
import { AuthProvider } from './store/AuthContext'
import ConfigContext from './store/ConfigContext.jsx'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: null,
            first_login: false,
            loginData: [],
            loadedConfig: [],
            configLoaded: false,
            loggedInUserIsAdmin: false,
        }

        this.setLoggedInStatus = this.setLoggedInStatus.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.loadConfig = this.loadConfig.bind(this)
    }

    setLoggedInStatus = (status) => {
        this.setState({ isLoggedIn: status })
        return true
    }

    loadConfig = () => {
        let configHeaders = new Headers()
        if (localStorage.getItem('token') !== undefined) {
            configHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        }
        configHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

        let requestOptions = {
            method: 'GET',
            headers: configHeaders,
            redirect: 'follow',
        }

        let responseStatus = ''
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/settings', requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                let resultData = {
                    app: {},
                    server: {},
                    analytics: {},
                }

                result.forEach((configItems) => {
                    if (configItems.config_key === 'app.name') {
                        resultData.app.name = configItems.config_value
                    }
                    if (configItems.config_key === 'app.logo') {
                        resultData.app.logo = configItems.config_value
                    }
                    if (configItems.config_key === 'app.locale') {
                        resultData.app.locale = configItems.config_value
                    }
                    if (configItems.config_key === 'app.url') {
                        resultData.app.url = configItems.config_value
                    }
                    if (configItems.config_key === 'app.registration_enabled') {
                        resultData.app.registration_enabled = configItems.config_value
                    }
                    if (configItems.config_key === 'app.password_reset_enabled') {
                        if (this.state.loggedInUserIsAdmin) {
                            resultData.app.password_reset_enabled = true
                        } else {
                            resultData.app.password_reset_enabled = configItems.config_value
                        }
                    }
                    if (configItems.config_key === 'app.group_creation_enabled') {
                        if (this.state.loggedInUserIsAdmin) {
                            resultData.app.group_creation_enabled = true
                        } else {
                            resultData.app.group_creation_enabled = configItems.config_value
                        }
                    }
                    if (configItems.config_key === 'app.minimum_search_length') {
                        resultData.app.minimum_search_length = configItems.config_value
                    }
                    if (configItems.config_key === 'app.maximum_posts_per_page') {
                        resultData.app.maximum_posts_per_page = configItems.config_value
                    }
                    if (configItems.config_key === 'server.api_url') {
                        resultData.server.api_url = configItems.config_value
                    }
                    if (configItems.config_key === 'analytics.google_analytics.enabled') {
                        resultData.analytics.google_analytics_enabled = configItems.config_value
                    }
                    if (configItems.config_key === 'analytics.google_analytics.key') {
                        resultData.analytics.google_analytics_key = configItems.config_value
                    }
                    if (configItems.config_key === 'analytics.sentry.enabled') {
                        resultData.analytics.sentry_enabled = configItems.config_value
                    }
                    if (configItems.config_key === 'analytics.sentry.dsn') {
                        resultData.analytics.sentry_dsn = configItems.config_value
                    }
                })

                this.setState({ loadedConfig: resultData, configLoaded: true })
            })
    }

    componentDidMount() {
        const that = this

        this.loadConfig()
        setTimeout(() => {
            this.activityLogger()
        }, 5000)

        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
            let tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            tokenHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            let requestOptions = {
                method: 'GET',
                headers: tokenHeaders,
                redirect: 'follow',
            }

            let responseStatus = ''
            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/auth/user', requestOptions)
                .then((response) => {
                    responseStatus = response.status
                    return response.json()
                })
                .then((result) => {
                    if (responseStatus === 200) {
                        localStorage.setItem('user_id', result.data.id)
                        localStorage.setItem('user_name', result.data.name)
                        localStorage.setItem('user_email', result.data.email)
                        localStorage.setItem('user_admin', result.data.is_admin)

                        if (result.data.is_admin == '1') {
                            this.setState({ loggedInUserIsAdmin: true })
                        }

                        if (result.data.cookie_choice != '') {
                            localStorage.setItem('cookies_accepted', result.data.cookie_choice)
                        }

                        this.setLoggedInStatus(true)
                        this.setState({ loginData: result.data })

                        this.loadConfig()
                    } else {
                        let cookiesAcceptedDecision = ''

                        if (localStorage.getItem('cookies_accepted') !== null) {
                            cookiesAcceptedDecision = localStorage.getItem('cookies_accepted')
                        }

                        localStorage.clear()

                        if (cookiesAcceptedDecision !== '') {
                            localStorage.setItem('cookies_accepted', cookiesAcceptedDecision)
                        }

                        this.setLoggedInStatus(false)
                    }
                })
        } else {
            let cookiesAcceptedDecision = ''

            if (localStorage.getItem('cookies_accepted') !== null) {
                cookiesAcceptedDecision = localStorage.getItem('cookies_accepted')
            }

            localStorage.clear()

            if (cookiesAcceptedDecision !== '') {
                localStorage.setItem('cookies_accepted', cookiesAcceptedDecision)
            }

            this.setLoggedInStatus(false)
        }

        if (localStorage.getItem('first_login') == 'true') {
            this.setState({ first_login: true })
            localStorage.removeItem('first_login')
        }

        setInterval(() => {
            this.activityLogger()
        }, 180000) // Every 3 minutes
    }

    handleStateChange() {
        this.setState({ first_login: false })
        localStorage.removeItem('first_login')
    }

    activityLogger() {
        if (this.state.isLoggedIn) {
            // Send Active-State

            let activityTokenHeaders = new Headers()
            activityTokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            const activityRequestOptions = {
                method: 'POST',
                headers: activityTokenHeaders,
                body: JSON.stringify({
                    active: true,
                }),
            }

            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/auth/activity', activityRequestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    if (response.token) {
                        localStorage.setItem('token', response.token)
                    }
                })
        }
    }

    render() {
        return (
            <ConfigContext.Provider value={this.state.loadedConfig}>
                <BrowserRouter>
                    {this.state.first_login && <FirstLogin handleStateChange={this.handleStateChange} />}

                    {this.state.isLoggedIn === true && this.state.configLoaded === true && (
                        <AuthProvider value={this.state.loginData}>
                            <Routes>
                                <Route exact path="/" element={<Navigate to="/app" />} />
                                <Route exact path="/app" element={<MainApp />} />
                                <Route exact path="/app/post/:postId" element={<SinglePost />} />
                                <Route exact path="/app/topic/:hashTag" element={<Topic />} />
                                <Route exact path="/logout" element={<LogOut />} />
                                <Route exact path="/app/user/:email" element={<User />} />
                                <Route exact path="/app/group/:id" element={<Group />} />
                                <Route exact path="/app/groups" element={<Groups />} />
                                <Route exact path="/app/group-request-approved" element={<GroupRequestApproved />} />
                                <Route exact path="/app/group-request-pending" element={<GroupRequestPending />} />
                                <Route exact path="/app/group/:id/request/:request_id/:request_status" element={<GroupRequestUpdate />} />
                                <Route exact path="/app/knowledgebase" element={<KnowledgeBase />} />
                                <Route exact path="/app/knowledgebase/:folderId" element={<KnowledgeBase />} />
                                <Route exact path="/app/knowledgebase/:folderId/:fileId" element={<KnowledgeBase />} />
                                <Route exact path="/app/knowledgebase/:folderId/:fileId/:historyId" element={<KnowledgeBase />} />
                                {this.state.loggedInUserIsAdmin && (
                                    <React.Fragment>
                                        <Route path="/app/settings/:category" element={<Settings />} />
                                        <Route exact path="/app/settings" element={<Navigate to="/app/settings/overview" />} />
                                    </React.Fragment>
                                )}
                                <Route path="*" element={<Error404 />} />
                            </Routes>
                        </AuthProvider>
                    )}
                    <Routes>
                        {this.state.isLoggedIn === false && this.state.configLoaded === true && (
                            <React.Fragment>
                                <Route exact path="/" element={<SignIn />} />
                                <Route path="/app" element={<Navigate to={`/?ref=${window.location.pathname}`} />} />
                                <Route exact path="/signup" element={<SignUpWrapper />} />
                                <Route path="/signup/activate/:token" element={<ActivateAccount />} />
                                <Route exact path="/password-reset" element={<PasswordReset />} />
                                <Route exact path="/logout" element={<LogOut />} />
                                <Route path="*" element={<Error404 />} />
                            </React.Fragment>
                        )}
                        {(this.state.isLoggedIn === null || this.state.configLoaded == null || this.state.configLoaded == false) && (
                            <React.Fragment>
                                <Route path="/*" element={<Loader className="app-loader" active size="large" content="Initializing WorkGroup..." />}></Route>
                            </React.Fragment>
                        )}
                    </Routes>
                    {this.state.configLoaded === true && <CookieBanner isLoggedIn={this.state.isLoggedIn} />}
                </BrowserRouter>
            </ConfigContext.Provider>
        )
    }
}
export default App
