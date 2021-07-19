/* eslint-disable no-useless-constructor */
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Message, Loader } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'

function ActivateAccount() {
    let { token } = useParams()

    const [isActivating, setIsActivating] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
            }),
        }

        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/auth/activate', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error == false) {
                    setIsActivating(false)
                    setHasError(false)
                } else {
                    setIsActivating(false)
                    setHasError(true)
                }
            })
    }, [])

    return (
        <>
            <div className="loginContainer">
                <img className="logo" alt="Logo" src={logo} />

                <div className="formContainer">
                    {isActivating ? (
                        <>
                            <h3>Your account is being activated...</h3>

                            <Loader active size="large" content="Please wait..." />
                        </>
                    ) : hasError ? (
                        <>
                            <h3>Your account could not be activated!</h3>

                            <p className="activate-account-text">Unfortunately we could not activate your account. Please try again later.</p>
                        </>
                    ) : (
                        <>
                            <h3>Your account has been activated!</h3>

                            <p className="activate-account-text">Thanks for using WorkGroup.</p>
                        </>
                    )}
                </div>
            </div>
            <div className="loginBackground"></div>
        </>
    )
}
export default ActivateAccount
