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
import logo from '../../../static/logo.svg'
import { Button, Input, Message } from 'semantic-ui-react'
import firebase from 'firebase'

class SignUp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            passwordRepeat: '',
            error: false,
            isSigningUp: false,
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
        this.passwordRepeatChangeHandler = this.passwordRepeatChangeHandler.bind(
            this
        )
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
    passwordRepeatChangeHandler(event) {
        this.setState({ passwordRepeat: event.target.value })
    }

    handleSubmit(event) {
        this.setState({ isSigningUp: true })
        this.setState({ error: false })

        if (this.state.password === this.state.passwordRepeat) {
            if (
                this.state.email.trim() !== '' &&
                this.state.password.trim() !== '' &&
                this.state.passwordRepeat.trim() !== ''
            ) {
                setTimeout(() => {
                    firebase
                        .auth()
                        .createUserWithEmailAndPassword(
                            this.state.email,
                            this.state.password
                        )
                        .then((user) => {
                            window.location.href = '/app'
                        })
                        .catch((error) => {
                            this.setState({ error: 'already_registered' })
                            this.setState({ isSigningUp: false })
                        })
                }, 1000)
            } else {
                this.setState({ error: 'inputs_empty' })
                this.setState({ isSigningUp: false })
            }
        } else {
            this.setState({ error: 'password_does_not_match' })
            this.setState({ isSigningUp: false })
        }

        event.preventDefault()
    }

    render() {
        return (
            <div className="loginContainer">
                <img className="logo" alt="Logo" src={logo} />
                <div className="formContainer">
                    {this.state.error === 'already_registered' ? (
                        <Message negative>
                            <Message.Header>
                                Oh no! An error occurred 😢.
                            </Message.Header>
                            <p>This E-Mail is already registered!</p>
                        </Message>
                    ) : (
                        <div></div>
                    )}

                    {this.state.error === 'password_does_not_match' ? (
                        <Message negative>
                            <Message.Header>
                                Oh no! An error occurred 😢.
                            </Message.Header>
                            <p>The Passwords does not match!</p>
                        </Message>
                    ) : (
                        <div></div>
                    )}

                    {this.state.error === 'inputs_empty' ? (
                        <Message negative>
                            <Message.Header>
                                Oh no! An error occurred 😢.
                            </Message.Header>
                            <p>Please fill out everything!</p>
                        </Message>
                    ) : (
                        <div></div>
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
                        <Input
                            fluid
                            onChange={this.passwordRepeatChangeHandler}
                            type="password"
                            placeholder="Repeat password"
                            id="userPasswordRepeat"
                        />
                        <br />
                        {this.state.isSigningUp ? (
                            <Button loading primary type="submit">
                                Sign Up
                            </Button>
                        ) : (
                            <Button
                                primary
                                type="submit"
                                onClick={this.handleSubmit}
                            >
                                Sign Up
                            </Button>
                        )}

                        <Button href="/">Already registered? Sign In!</Button>
                    </form>
                    <p className="or-text">or</p>
                    <Button primary>Sign Up with Google</Button>
                </div>
            </div>
        )
    }
}
export default SignUp
