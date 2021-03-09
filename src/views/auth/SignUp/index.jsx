/* eslint-disable no-useless-constructor */
import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message, Card } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'

class SignUp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            password: '',
            passwordRepeat: '',
            error: false,
            isSigningUp: false,
        }
        this.nameChangeHandler = this.nameChangeHandler.bind(this)
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this)
        this.passwordRepeatChangeHandler = this.passwordRepeatChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        document.title = 'Sign Up – WorkGroup'
    }

    nameChangeHandler(event) {
        this.setState({ name: event.target.value })
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
            if (this.state.name.trim() !== '' && this.state.email.trim() !== '' && this.state.password.trim() !== '' && this.state.passwordRepeat.trim() !== '') {
                setTimeout(() => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: this.state.name,
                            email: this.state.email,
                            password: this.state.password,
                            password_confirmation: this.state.passwordRepeat,
                        }),
                    }
                    // eslint-disable-next-line no-undef
                    fetch(process.env.REACT_APP_API_URL + '/api/auth/register', requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message == 'Register success') {
                                const requestOptions = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        email: this.state.email,
                                        password: this.state.password,
                                    }),
                                }
                                // eslint-disable-next-line no-undef
                                fetch(process.env.REACT_APP_API_URL + '/api/auth/login', requestOptions)
                                    .then((response) => response.json())
                                    .then((data) => {
                                        console.log(data)
                                        if (data.message == 'Login success') {
                                            localStorage.setItem('token', data.data.token)
                                            this.setState({ isLoggedIn: true })
                                            localStorage.setItem('first_login', true);
                                            location.href = '/'
                                        }
                                    })
                            } else if (data.message == 'User existing') {
                                this.setState({ error: 'already_registered' })
                                this.setState({ isSigningUp: false })
                            }
                        })
                }, 300)
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
                <Card className="login-card">
                    <Card.Content>
                        <div className="formContainer">
                            <h3>Sign Up to use WorkGroup</h3>

                            {this.state.error === 'already_registered' ? (
                                <Message negative>
                                    <Message.Header>Oh no! An error occurred😢.</Message.Header>
                                    <p> This E - Mail is already registered! </p>
                                </Message>
                            ) : (
                                <div />
                            )}
                            {this.state.error === 'password_does_not_match' ? (
                                <Message negative>
                                    <Message.Header>Oh no! An error occurred😢.</Message.Header>
                                    <p> The Passwords does not match! </p>
                                </Message>
                            ) : (
                                <div />
                            )}
                            {this.state.error === 'inputs_empty' ? (
                                <Message negative>
                                    <Message.Header>Oh no! An error occurred😢.</Message.Header>
                                    <p> Please fill out everything! </p>
                                </Message>
                            ) : (
                                <div />
                            )}

                            <form className="" onSubmit={this.handleSubmit}>
                                <Input autoFocus fluid onChange={this.nameChangeHandler} type="text" placeholder="Name" id="userName" />
                                <br />
                                <Input fluid onChange={this.emailChangeHandler} type="email" placeholder="E-Mail" id="userEmail" />
                                <br />
                                <Input fluid onChange={this.passwordChangeHandler} type="password" placeholder="Password" id="userPassword" />
                                <br />
                                <Input fluid onChange={this.passwordRepeatChangeHandler} type="password" placeholder="Repeat password" id="userPasswordRepeat" />
                                <br />
                                {this.state.isSigningUp ? (
                                    <Button loading primary type="submit">
                                        Sign Up
                                    </Button>
                                ) : (
                                    <Button primary type="submit" onClick={this.handleSubmit}>
                                        Sign Up
                                    </Button>
                                )}
                                <Button href="/">Already registered?</Button>
                            </form>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        )
    }
}
export default SignUp
