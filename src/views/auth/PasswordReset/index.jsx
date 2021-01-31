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
import logo from '../../../static/logo.svg'

class PasswordReset extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            error: false,
            isResetting: false,
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {}

    emailChangeHandler(event) {
        this.setState({ email: event.target.value })
    }

    handleSubmit(event) {
        this.setState({ isResetting: true })
        this.setState({ error: false })

        if (this.state.email.trim() !== '') {
            setTimeout(() => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.state.email,
                    }),
                }
                // eslint-disable-next-line no-undef
                fetch(
                    process.env.REACT_APP_API_URL + '/api/auth/reset',
                    requestOptions
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message == 'Register success') {
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: this.state.email,
                                    password: this.state.password,
                                }),
                            }
                            // eslint-disable-next-line no-undef
                            fetch(
                                process.env.REACT_APP_API_URL +
                                    '/api/auth/login',
                                requestOptions
                            )
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(data)
                                    if (data.message == 'Login success') {
                                        localStorage.setItem(
                                            'token',
                                            data.data.token
                                        )
                                        this.setState({ isLoggedIn: true })
                                        location.href = '/'
                                    }
                                })
                        } else if (data.message == 'User existing') {
                            this.setState({ error: 'already_registered' })
                            this.setState({ isResetting: false })
                        }
                    })
            }, 300)
        } else {
            this.setState({ error: 'inputs_empty' })
            this.setState({ isResetting: false })
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
                                Oh no!An error occurred😢.
                            </Message.Header>
                            <p> This E - Mail is already registered! </p>
                        </Message>
                    ) : (
                        <div />
                    )}
                    {this.state.error === 'password_does_not_match' ? (
                        <Message negative>
                            <Message.Header>
                                Oh no!An error occurred😢.
                            </Message.Header>
                            <p> The Passwords does not match! </p>
                        </Message>
                    ) : (
                        <div />
                    )}
                    {this.state.error === 'inputs_empty' ? (
                        <Message negative>
                            <Message.Header>
                                Oh no!An error occurred😢.
                            </Message.Header>
                            <p> Please fill out everything! </p>
                        </Message>
                    ) : (
                        <div />
                    )}
                    <form className="" onSubmit={this.handleSubmit}>
                        <Input
                            autoFocus
                            fluid
                            onChange={this.nameChangeHandler}
                            type="text"
                            placeholder="Name"
                            id="userName"
                        />
                        <br />
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
                        {this.state.isResetting ? (
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
                        <Button href="/">
                            
                            Already registered ? Sign In!
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}
export default PasswordReset
