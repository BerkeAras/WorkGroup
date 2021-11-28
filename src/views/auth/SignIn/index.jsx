import React, { useCallback, useEffect, useState, useContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message, Card } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'
import ConfigContext from '../../../store/ConfigContext'

const SignIn = () => {
    const contextValue = useContext(ConfigContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const [connectionError, setConnectionError] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [canLogin, setCanLogin] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const emailChangeHandler = (event) => {
        setEmail(event.target.value)
    }

    const passwordChangeHandler = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = useCallback(
        (event) => {
            setIsLoggingIn(true)

            setTimeout(() => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }

                // eslint-disable-next-line no-undef
                fetch(process.env.REACT_APP_API_URL + '/api/auth/login', requestOptions).then((response) => {
                    if (response.status == 200) {
                        response.json().then((json) => {
                            if (json.message == 'Login success') {
                                localStorage.setItem('token', json.data.token)
                                setIsLoggedIn(true)
                                location.href = '/'
                            } else {
                                setIsLoggedIn(false)
                                setIsLoggingIn(false)
                                setError(true)
                            }
                        })
                    } else {
                        setIsLoggedIn(false)
                        setIsLoggingIn(false)
                        setError(true)
                    }
                })
            }, 300)

            event.preventDefault()
        },
        [email, password]
    )

    useEffect(() => {
        setCanLogin(!!email && !!password)

        fetch(process.env.REACT_APP_API_URL + `/api/check`)
            .then((res) => res.text())
            .then((res) => {
                if (res == 'OK') {
                    setConnectionError(false)
                } else {
                    setConnectionError(true)
                }
            })
    }, [email, password, contextValue])

    useEffect(() => {
        document.title = 'Sign In – WorkGroup'
    }, [])

    return (
        <>
            <div className="loginContainer">
                <img className="logo" alt="Logo" src={logo} />
                <div className="formContainer">
                    {connectionError ? (
                        <Message negative>
                            <Message.Header>We are currently having server issues 😢.</Message.Header>
                            <p>No database connection could be established! Please contact your administrator.</p>
                        </Message>
                    ) : (
                        <>
                            <h3>Sign In into WorkGroup</h3>

                            {error && (
                                <Message negative>
                                    <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                    <p> E-Mail or password incorrect! </p>
                                </Message>
                            )}
                            <form className="" onSubmit={handleSubmit}>
                                <Input fluid onChange={emailChangeHandler} type="email" placeholder="E-Mail" id="userEmail" />
                                <br />
                                <Input fluid onChange={passwordChangeHandler} type="password" placeholder="Password" id="userPassword" />
                                <br />
                                {isLoggingIn ? (
                                    <Button loading primary disabled={!canLogin} type="submit">
                                        Sign In
                                    </Button>
                                ) : (
                                    <Button primary disabled={!canLogin} type="submit" onClick={handleSubmit}>
                                        Sign In
                                    </Button>
                                )}

                                {contextValue != undefined && contextValue.app.registration_enabled == 'true' && (
                                    <Button as={Link} to="/signup">
                                        No account ? Sign Up!
                                    </Button>
                                )}
                            </form>
                            <p className="text-center my-3">
                                <br />
                                {contextValue != undefined && contextValue.app.password_reset_enabled == 'true' && <Link to="/password-reset">Forgot Password?</Link>}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="loginBackground"></div>
        </>
    )
}

export default SignIn
