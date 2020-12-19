/* eslint-disable no-useless-constructor */
import React, { useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom'
import './style.scss'
import { Button, Input, Message } from 'semantic-ui-react'
import firebase from 'firebase'
import logo from '../../../static/logo.svg'

class SignIn extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            error: false,
            isLoggingIn: false,
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                window.location.href = '/app'
            }
        })
    }

    emailChangeHandler(event) {
        this.setState({ email: event.target.value })
    }

    passwordChangeHandler(event) {
        this.setState({ password: event.target.value })
    }

    handleSubmit(event) {
        this.setState({ isLoggingIn: true })

        setTimeout(() => {
            firebase
                .auth()
                .signInWithEmailAndPassword(
                    this.state.email,
                    this.state.password
                )
                .then((user) => {
                    window.location.href = '/app'
                })
                .catch((error) => {
                    this.setState({ error: true })
                    this.setState({ isLoggingIn: false })
                })
        }, 1000)

        event.preventDefault()
    }

    render() {
        return (
            <div className="loginContainer">
                <img className="logo" alt="Logo" src={logo} />
                <div className="formContainer">
                    {this.state.error ? (
                        <Message negative>
                            <Message.Header>
                                Oh no! An error occurred 😢.
                            </Message.Header>
                            <p>E-Mail or password incorrect!</p>
                        </Message>
                    ) : (
                        <div />
                    )}

                    <form className="" onSubmit={this.handleSubmit}>
                        <Input
                            fluid
                            onChange={this.emailChangeHandler}
                            type="email"
                            placeholder="E-Mail"
                            id="userEmail"
                        />
                        <br />
                        <Input
                            fluid
                            onChange={this.passwordChangeHandler}
                            type="password"
                            placeholder="Password"
                            id="userPassword"
                        />
                        <br />
                        {this.state.isLoggingIn ? (
                            <Button loading primary type="submit">
                                Sign In
                            </Button>
                        ) : (
                            <Button
                                primary
                                type="submit"
                                onClick={this.handleSubmit}
                            >
                                Sign In
                            </Button>
                        )}

                        <Button href="/signUp">No account? Sign Up!</Button>
                    </form>
                    <p className="or-text">or</p>
                    <Button primary>Sign In with Google</Button>
                    <p className="text-center my-3">
                        <br /> <Link to="/passwordReset">Forgot Password?</Link>
                    </p>
                </div>
            </div>
        )
    }
}
export default SignIn
