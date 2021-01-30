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
import { Button, Input, Message, Card } from 'semantic-ui-react'
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
            
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                })
            };
            fetch(process.env.REACT_APP_API_URL + '/api/auth/login', requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.message == "Login success") {
                        localStorage.setItem('token', data.data.token);
                        this.setState({isLoggedIn: true});
                        location.href = "/";
                    }
                });

        }, 1000)

        event.preventDefault()
    }

    render() {
        return (
            <div className="loginContainer">
                <img className="logo" alt="Logo" src={logo} />

                <Card className="login-card">
                    <Card.Content>
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
                            <p className="text-center my-3">
                                <br /> <Link to="/password-reset">Forgot Password?</Link>
                            </p>
                        </div>
                        
                    </Card.Content>
                </Card>
            </div>
        )
    }
}
export default SignIn
