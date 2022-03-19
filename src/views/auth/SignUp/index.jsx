/* eslint-disable no-useless-constructor */
import React, { useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message, Loader } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'
import PropTypes from 'prop-types'
import ConfigContext from '../../../store/ConfigContext'
import validateEmail from '../../../utils/validateEmail'

const SignUpWrapper = () => {
    const [isWaitingForActivation, setIsWaitingForActivation] = useState(false)

    return (
        <>
            <div className="loginContainer">
                <Link to="/">
                    <img className="logo" alt="Logo" src={logo} />
                </Link>
                {!isWaitingForActivation ? <SignUp isWaitingForActivation={isWaitingForActivation} setIsWaitingForActivation={setIsWaitingForActivation} /> : <WaitActivation />}
            </div>
            <div className="loginBackground"></div>
        </>
    )
}

const WaitActivation = () => {
    return (
        <div className="formContainer">
            <h3>Please confirm your account.</h3>
            <p className="activate-account-text">To confirm your account, click the link in the email you just received.</p>
            <Loader active size="large" content="Waiting for confirmation... You will be redirected after clicking the link." />
        </div>
    )
}

const SignUp = (props) => {
    const contextValue = useContext(ConfigContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [error, setError] = useState(false)
    const [isSigningUp, setIsSigningUp] = useState(false)

    useEffect(() => {
        document.title = 'Sign Up – WorkGroup'
    }, [])

    const handleSubmit = (event) => {
        setIsSigningUp(true)
        setError(false)

        if (password === passwordRepeat) {
            if (name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && passwordRepeat.trim() !== '') {
                if (password.length < 8) {
                    setError('password_too_short')
                    setIsSigningUp(false)
                } else {
                    setTimeout(() => {

                        if (!validateEmail(email.trim())) {
                            setError('mail_not_valid')
                            setIsSigningUp(false)
                            return;
                        }

                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: name.trim(),
                                email: email.trim(),
                                password: password,
                                password_confirmation: passwordRepeat,
                            }),
                        }
                        // eslint-disable-next-line no-undef
                        fetch(process.env.REACT_APP_API_URL + '/api/auth/register', requestOptions)
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.message == 'Register success') {
                                    setIsSigningUp(false)
                                    props.setIsWaitingForActivation(true)
                                    waitForActivation()
                                } else if (data.message == 'User existing') {
                                    setError('already_registered')
                                    setIsSigningUp(false)
                                } else {
                                    setError('unknown_error')
                                    setIsSigningUp(false)
                                }
                            })
                    }, 300)
                }
            } else {
                setError('inputs_empty')
                setIsSigningUp(false)
            }
        } else {
            setError('password_does_not_match')
            setIsSigningUp(false)
        }

        event.preventDefault()
    }

    const waitForActivation = () => {
        const requestOptionsCheckActivation = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        let checkInterval = setInterval(() => {
            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/auth/checkActivation?email=' + email, requestOptionsCheckActivation)
                .then((response) => response.json())
                .then((data) => {
                    if (data.message == 'User activated') {
                        clearInterval(checkInterval)

                        const requestOptionsLogin = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: email,
                                password: password,
                            }),
                        }
                        // eslint-disable-next-line no-undef
                        fetch(process.env.REACT_APP_API_URL + '/api/auth/login', requestOptionsLogin)
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.message == 'Login success') {
                                    localStorage.setItem('token', data.data.token)
                                    // this.setState({ isLoggedIn: true })
                                    localStorage.setItem('first_login', true)
                                    location.href = '/'
                                }
                            })
                    }
                })
        }, 3000)
    }

    return (
        <>
            <div className="formContainer">
                <h3>Sign Up to use WorkGroup</h3>
                {error ? <ErrorMsg errorCode={error} /> : null}
                {contextValue != undefined &&
                    (contextValue.app.registration_enabled == 'false' ? (
                        <ErrorMsg errorCode={'no_permission'} />
                    ) : (
                        <form className="" onSubmit={(e) => handleSubmit(e)}>
                            <Input autoFocus fluid onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" placeholder="Name" id="userName" />
                            <br />
                            <Input fluid onChange={(e) => setEmail(e.target.value)} autoComplete="email" type="email" placeholder="E-Mail" id="userEmail" />
                            <small>Please enter your real e-mail address. You will need to confirm it in the next step.</small>
                            <br />
                            <br />
                            <Input fluid onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" type="password" placeholder="Password" id="userPassword" />
                            <br />
                            <Input fluid onChange={(e) => setPasswordRepeat(e.target.value)} autoComplete="new-password" type="password" placeholder="Repeat password" id="userPasswordRepeat" />
                            <br />
                            {isSigningUp ? (
                                <Button loading primary type="submit">
                                    Sign Up
                                </Button>
                            ) : (
                                <Button primary type="submit">
                                    Sign Up
                                </Button>
                            )}
                            <Button as={Link} to="/">
                                Already registered?
                            </Button>
                        </form>
                    ))}
            </div>
        </>
    )
}

SignUp.propTypes = {
    isWaitingForActivation: PropTypes.bool,
    setIsWaitingForActivation: PropTypes.func,
}

const ErrorMsg = (props) => {
    const errors = {
        already_registered: 'This E-Mail is already registered!',
        password_does_not_match: 'The Passwords dont match',
        inputs_empty: 'Please fill out everything!',
        password_too_short: 'Your password is too short! Please enter at least 8 characters.',
        no_permission: 'You do not have permission to sign up.',
        unknown_error: 'An unknown error occured! Please try again later.',
        mail_not_valid: 'Your E-Mail Address does not look correct. Are you sure you entered it correctly?'
    }

    return (
        <Message negative>
            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
            <p>{errors[props.errorCode]}</p>
        </Message>
    )
}

ErrorMsg.propTypes = {
    errorCode: PropTypes.string,
}

export default SignUpWrapper
