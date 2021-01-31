import React, { Component } from 'react'
import './scss/style.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom'
import SignIn from './views/auth/SignIn'
import SignUp from './views/auth/SignUp'
import ProfilePage from './views/auth/ProfilePage'
import PasswordReset from './views/auth/PasswordReset'
import LogOut from './views/auth/LogOut'
import MainApp from './views/App'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoggedIn: false,
        }
        this.setLoggedInStatus = this.setLoggedInStatus.bind(this)
    }

    setLoggedInStatus = (status) => {
        this.setState({ isLoggedIn: status })
        return true
    }

    componentDidMount() {
        const that = this

        if (
            localStorage.getItem('token') !== null &&
            localStorage.getItem('token') !== undefined
        ) {
            var tokenHeaders = new Headers()
            tokenHeaders.append(
                'Authorization',
                'Bearer ' + localStorage.getItem('token')
            )

            var requestOptions = {
                method: 'GET',
                headers: tokenHeaders,
                redirect: 'follow',
            }

            // eslint-disable-next-line no-undef
            fetch(
                process.env.REACT_APP_API_URL + '/api/auth/user',
                requestOptions
            )
                .then((response) => response.json())
                .then((result) => {
                    if (result.message == 'Authenticated user') {
                        localStorage.setItem('user_id', result.data.id)
                        localStorage.setItem('user_name', result.data.name)
                        localStorage.setItem('user_email', result.data.email)

                        this.setLoggedInStatus(true)
                    } else if (
                        result.message ==
                        'Token Signature could not be verified.'
                    ) {
                        localStorage.clear()
                        this.setLoggedInStatus(false)
                    } else if (result.message == '405 Method Not Allowed') {
                        localStorage.clear()
                        this.setLoggedInStatus(false)
                    } else if (
                        result.message == 'The token has been blacklisted'
                    ) {
                        localStorage.clear()
                        this.setLoggedInStatus(false)
                    }
                })
                .catch((error) => console.log('error', error))
        }
    }

    render() {
        return (
            <Router>
                <Switch>
                    
                    {this.state.isLoggedIn ? (
                        <React.Fragment>
                            <Route exact path="/">
                                <Redirect to="/app" />
                            </Route>
                            <Route exact path="/app">
                                <MainApp />
                            </Route>
                            <Route exact path="/logout">
                                <LogOut />
                            </Route>
                        </React.Fragment>
                    ) : (
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
                            <Route exact path="/password-reset">
                                <PasswordReset />
                            </Route>
                        </React.Fragment>
                    )}
                </Switch>
            </Router>
        )
    }
}
export default App
