import React, { Component } from 'react'
import './scss/style.scss'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import SignIn from './views/auth/SignIn'
import SignUp from './views/auth/SignUp'
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
import Error404 from './views/Error404'
import KnowledgeBase from './views/KnowledgeBase'
import { Loader } from 'semantic-ui-react'

import FirstLogin from './components/_User_FirstLogin'
import CookieBanner from './components/_App_CookieBanner'
import { AuthProvider } from './store/AuthContext'
import ConfigContext from './store/ConfigContext.jsx'
import SignUpWrapper from './views/auth/SignUp'

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
                        resultData.app.password_reset_enabled = configItems.config_value
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
                <Router>
                    {this.state.first_login && <FirstLogin handleStateChange={this.handleStateChange} />}
                    <Switch>
                        {this.state.isLoggedIn === true && this.state.configLoaded === true && (
                            <AuthProvider value={this.state.loginData}>
                                <Route exact path="/">
                                    <Redirect to="/app" />
                                </Route>
                                <Route exact path="/app">
                                    <MainApp />
                                </Route>
                                <Route exact path="/logout">
                                    <LogOut />
                                </Route>
                                <Route path="/app/user/:email">
                                    <User />
                                </Route>
                                <Route path="/app/group/:id" exact>
                                    <Group />
                                </Route>
                                <Route path="/app/groups">
                                    <Groups />
                                </Route>
                                <Route path="/app/group-request-approved">
                                    <GroupRequestApproved />
                                </Route>
                                <Route path="/app/group-request-pending">
                                    <GroupRequestPending />
                                </Route>
                                <Route exact path="/app/group/:id/request/:request_id/:request_status">
                                    <GroupRequestUpdate />
                                </Route>
                                <Route exact path="/app/knowledgebase">
                                    <KnowledgeBase />
                                </Route>
                                <Route exact path="/app/knowledgebase/:folderId">
                                    <KnowledgeBase />
                                </Route>
                                <Route exact path="/app/knowledgebase/:folderId/:fileId">
                                    <KnowledgeBase />
                                </Route>
                                <Route exact path="/app/knowledgebase/:folderId/:fileId/:historyId">
                                    <KnowledgeBase />
                                </Route>
                                {this.state.loggedInUserIsAdmin && (
                                    <>
                                        <Route path="/app/settings/:category">
                                            <Settings />
                                        </Route>
                                        <Route exact path="/app/settings">
                                            <Redirect to="/app/settings/overview" />
                                        </Route>
                                    </>
                                )}
                            </AuthProvider>
                        )}
                        {this.state.isLoggedIn === false && this.state.configLoaded === true && (
                            <React.Fragment>
                                <Route exact path="/">
                                    <SignIn />
                                </Route>
                                <Route path="/app">
                                    <Redirect to="/" />
                                </Route>
                                <Route exact path="/signup">
                                    <SignUpWrapper />
                                </Route>
                                <Route path="/signup/activate/:token">
                                    <ActivateAccount />
                                </Route>
                                <Route exact path="/password-reset">
                                    <PasswordReset />
                                </Route>
                                <Route exact path="/logout">
                                    <LogOut />
                                </Route>
                                <Route path="*">
                                    <SignIn />
                                </Route>
                            </React.Fragment>
                        )}
                        {(this.state.isLoggedIn === null || this.state.configLoaded == null || this.state.configLoaded == false) && (
                            <React.Fragment>
                                <Route path="/*">
                                    <Loader className="app-loader" active size="large" content="Initializing WorkGroup..." />
                                </Route>
                            </React.Fragment>
                        )}
                    </Switch>
                    {this.state.configLoaded === true && <CookieBanner isLoggedIn={this.state.isLoggedIn} />}
                </Router>
            </ConfigContext.Provider>
        )
    }
}
export default App
