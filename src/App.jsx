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
import { Loader } from 'semantic-ui-react'

import FirstLogin from './components/_User_FirstLogin'
import CookieBanner from './components/_App_CookieBanner'
import { AuthProvider } from './store/AuthContext'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: null,
            first_login: false,
            loginData: [],
        }
        this.setLoggedInStatus = this.setLoggedInStatus.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
    }

    setLoggedInStatus = (status) => {
        this.setState({ isLoggedIn: status })
        return true
    }

    componentDidMount() {
        const that = this

        if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
            var tokenHeaders = new Headers()
            tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            tokenHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

            var requestOptions = {
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
                        localStorage.setItem('cookies_accepted', result.data.cookie_choice)

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
                .catch((error) => console.log('error', error))
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
            if (this.state.isLoggedIn) {
                // Send Active-State

                var activityTokenHeaders = new Headers()
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
            }
        }, 60 * 1000)
    }

    handleStateChange() {
        this.setState({ first_login: false })
        localStorage.removeItem('first_login')
    }

    render() {
        return (
            <Router>
                {this.state.first_login && <FirstLogin handleStateChange={this.handleStateChange} />}
                <Switch>
                    {this.state.isLoggedIn === true && (
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
                        </AuthProvider>
                    )}
                    {this.state.isLoggedIn === false && (
                        <React.Fragment>
                            <Route exact path="/">
                                <SignIn />
                            </Route>
                            <Route path="/app">
                                <Redirect to="/" />
                            </Route>
                            <Route exact path="/signup">
                                <SignUp />
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
                        </React.Fragment>
                    )}
                    {this.state.isLoggedIn === null && (
                        <React.Fragment>
                            <Route path="/*">
                                <Loader className="app-loader" active size="large" content="Initializing WorkGroup..." />
                            </Route>
                        </React.Fragment>
                    )}
                </Switch>
                {process.env.REACT_APP_USE_GOOGLE_ANALYTICS == 'true' && <CookieBanner />}
            </Router>
        )
    }
}
export default App
