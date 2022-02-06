import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Modal, Message, Button, Form, Loader, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import AuthContext from '../../../store/AuthContext'
import { CheckCircle } from 'react-feather'
import W_Modal from '../../W_Modal'

export default function ChangePassword(props) {
    const contextValue = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [resetStep, setResetStep] = useState(1)
    const [resetToken, setResetToken] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        if (props.isOpenState) {
            // Send E-Mail with PIN
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: contextValue.email,
                }),
            }
            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/auth/reset', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.message == 'Reset success') {
                        setIsLoading(false)
                        setError('')
                        setResetStep(1)
                        setResetToken(data.token)
                    } else {
                        setIsLoading(false)
                        setError('An error occured. Please try again later.')
                        setResetStep(0)
                    }
                })
        }
    }, [props.isOpenState])

    const resetPassword = () => {
        setIsLoading(true)

        if (resetStep == 1) {
            // Check if pin is correct
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pin: pin,
                    email: contextValue.email,
                    token: resetToken,
                }),
            }
            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/auth/reset/2', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.message == 'PIN correct') {
                        setIsLoading(false)
                        setError('')
                        setResetStep(2)
                    } else if (data.message == 'PIN incorrect') {
                        setIsLoading(false)
                        setError('The PIN you entered is incorrect. Please try again.')
                        setResetStep(1)
                    }
                })
        } else if (resetStep == 2) {
            // Check if passwords match
            if (password != confirmPassword) {
                setIsLoading(false)
                setError('The passwords you entered do not match.')
                setResetStep(2)
            } else {
                // Check if password is longer than 8 characters
                if (password.length < 8) {
                    setIsLoading(false)
                    setError('The password you entered is too short. Please enter a password with at least 8 characters.')
                    setResetStep(2)
                } else {
                    // Reset Password
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: contextValue.email,
                            token: resetToken,
                            pin: pin,
                            password: password,
                            password_confirmation: confirmPassword,
                        }),
                    }
                    // eslint-disable-next-line no-undef
                    fetch(process.env.REACT_APP_API_URL + '/api/auth/reset/3', requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message == 'Password resetted') {
                                setIsLoading(false)
                                setError('')
                                setResetStep(3)
                            } else if (data.message == 'PIN incorrect') {
                                setIsLoading(false)
                                setError('The PIN you entered is incorrect. Please try again.')
                                setResetStep(1)
                            } else {
                                setIsLoading(false)
                                setError('An error occured. Please try again later.')
                                setResetStep(0)
                            }
                        })
                }
            }
        } else {
            props.isOpenStateController(false)
        }
    }

    return (
        <W_Modal
            onClose={() => props.isOpenStateController(false)}
            onOpen={() => {
                props.isOpenStateController(true)
            }}
            open={props.isOpenState}
            size="tiny"
            className="password-reset-modal"
        >
            <Modal.Header>Reset your Password</Modal.Header>
            <Modal.Content>
                {error != '' && (
                    <Message negative>
                        <Message.Header>Warning:</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}

                {isLoading ? (
                    <div className="password-reset-modal-loader">
                        <Loader size="medium" active>
                            Loading...
                        </Loader>
                    </div>
                ) : (
                    <>
                        {resetStep === 1 && (
                            <>
                                <p>Please type in the PIN you just received to reset your password.</p>
                                <Form.Field>
                                    <Input
                                        autoFocus
                                        fluid
                                        onChange={(e) => {
                                            setPin(e.target.value)
                                        }}
                                        type="text"
                                        value={pin}
                                        maxLength="6"
                                        placeholder="PIN"
                                        className="userPin"
                                    />
                                </Form.Field>
                            </>
                        )}

                        {resetStep === 2 && (
                            <>
                                <p>Please type in your new password below.</p>
                                <Form.Field>
                                    <Input
                                        autoFocus
                                        fluid
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        type="password"
                                        minLength="8"
                                        value={password}
                                        placeholder="New Password"
                                    />
                                </Form.Field>
                                <br />
                                <Form.Field>
                                    <Input
                                        fluid
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                        }}
                                        type="password"
                                        minLength="8"
                                        value={confirmPassword}
                                        placeholder="Confirm Password"
                                    />
                                </Form.Field>
                            </>
                        )}

                        {resetStep === 3 && (
                            <center>
                                <CheckCircle size={35} strokeWidth={2} />
                                <br />
                                <span>Your password has been changed successfully!</span>
                            </center>
                        )}
                    </>
                )}
            </Modal.Content>
            <Modal.Actions>
                {resetStep !== 3 && (
                    <Button color="black" onClick={() => props.isOpenStateController(false)}>
                        Cancel
                    </Button>
                )}
                {isLoading ? (
                    <Button content={resetStep == 3 ? 'Close' : 'Next step'} positive loading />
                ) : (
                    <Button content={resetStep == 3 ? 'Close' : 'Next step'} onClick={resetPassword} positive />
                )}
            </Modal.Actions>
        </W_Modal>
    )
}

ChangePassword.propTypes = {
    isOpenState: PropTypes.bool.isRequired,
    isOpenStateController: PropTypes.func.isRequired,
}
