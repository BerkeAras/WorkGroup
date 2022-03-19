/* eslint-disable no-useless-constructor */
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import './style.scss'
import { Button, Input, Message } from 'semantic-ui-react'
import logo from '../../../static/logo.svg'
import ConfigContext from '../../../store/ConfigContext'
import validateEmail from '../../../utils/validateEmail'

class PasswordReset extends React.Component {
    static contextType = ConfigContext

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            error: false,
            success: false,
            isResetting: false,
            showPinCard: '0',
            pinCardEmail: '',
            pin: '',
            resetToken: '',
            password1: '',
            password2: '',
        }
        this.emailChangeHandler = this.emailChangeHandler.bind(this)
        this.pinChangeHandler = this.pinChangeHandler.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePinSubmit = this.handlePinSubmit.bind(this)
        this.password1ChangeHandler = this.password1ChangeHandler.bind(this)
        this.password2ChangeHandler = this.password2ChangeHandler.bind(this)
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this)
    }

    componentDidMount() {
        document.title = 'Reset your Password – WorkGroup'
    }

    emailChangeHandler(event) {
        this.setState({ email: event.target.value })
    }

    pinChangeHandler(event) {
        this.setState({ pin: event.target.value })
    }

    password1ChangeHandler(event) {
        this.setState({ password1: event.target.value })
    }

    password2ChangeHandler(event) {
        this.setState({ password2: event.target.value })
    }

    handleSubmit(event) {
        this.setState({ isResetting: true })
        this.setState({ error: false })

        if (this.state.email.trim() !== '') {
            setTimeout(() => {

                if (!validateEmail(this.state.email.trim())) {
                    this.setState({ error: 'mail_not_valid' })
                    this.setState({ isResetting: false })
                    return;
                }

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.state.name,
                        email: this.state.email,
                    }),
                }
                // eslint-disable-next-line no-undef
                fetch(process.env.REACT_APP_API_URL + '/api/auth/reset', requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message == 'Reset success') {
                            this.setState({ isResetting: false })
                            this.setState({ error: false })
                            this.setState({ success: false })
                            this.setState({ showPinCard: '1' })
                            this.setState({ pinCardEmail: this.state.email })
                            this.setState({ resetToken: data.token })
                        } else if (data.message == 'User not existing') {
                            this.setState({ error: 'user_not_found' })
                            this.setState({ isResetting: false })
                        } else if (data.message == 'Reset error' || data.message == 'The given data failed to pass validation.') {
                            this.setState({ error: 'reset_error' })
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

    handlePinSubmit(event) {
        event.preventDefault()
        this.setState({ isResetting: true })
        this.setState({ error: false })
        this.setState({ success: false })

        if (this.state.pin.trim() !== '') {
            setTimeout(() => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pin: this.state.pin,
                        email: this.state.email,
                        token: this.state.resetToken,
                    }),
                }
                // eslint-disable-next-line no-undef
                fetch(process.env.REACT_APP_API_URL + '/api/auth/reset/2', requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.message == 'PIN correct') {
                            this.setState({ isResetting: false })
                            this.setState({ error: false })
                            this.setState({ success: false })
                            this.setState({ showPinCard: '2' })
                        } else if (data.message == 'PIN incorrect') {
                            this.setState({ error: 'pin_incorrect' })
                            this.setState({ isResetting: false })
                        }
                    })
            }, 300)
        } else {
            this.setState({ error: 'inputs_empty' })
            this.setState({ isResetting: false })
        }
    }

    handlePasswordSubmit(event) {
        event.preventDefault()
        this.setState({ isResetting: true })
        this.setState({ error: false })
        this.setState({ success: false })

        if (this.state.password1.trim() !== '' && this.state.password2.trim() !== '') {
            if (this.state.password1 !== this.state.password2) {
                this.setState({ error: 'password_does_not_match' })
                this.setState({ isResetting: false })
            } else {
                setTimeout(() => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: this.state.email,
                            token: this.state.resetToken,
                            pin: this.state.pin,
                            password: this.state.password1,
                            password_confirmation: this.state.password2,
                        }),
                    }
                    // eslint-disable-next-line no-undef
                    fetch(process.env.REACT_APP_API_URL + '/api/auth/reset/3', requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message == 'Password resetted') {
                                this.setState({ isResetting: false })
                                this.setState({ error: false })
                                this.setState({ success: false })
                                this.setState({ showPinCard: '3' })
                            } else if (data.message == 'PIN incorrect') {
                                this.setState({ error: 'pin_incorrect' })
                                this.setState({ isResetting: false })
                            } else if (data.message == 'The given data failed to pass validation.') {
                                this.setState({ error: 'password_insecure' })
                                this.setState({ isResetting: false })
                            }
                        })
                }, 300)
            }
        } else {
            this.setState({ error: 'inputs_empty' })
            this.setState({ isResetting: false })
        }
    }

    render() {
        return (
            <>
                <div className="loginContainer">
                    <Link to="/">
                        <img className="logo" alt="Logo" src={logo} />
                    </Link>
                    <>
                        {this.state.showPinCard == '0' && (
                            <>
                                <div className="formContainer">
                                    <h3>Reset your WorkGroup Password</h3>

                                    {this.context !== null &&
                                        (this.context.app.password_reset_enabled == 'false' ? (
                                            <Message negative>
                                                <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                                <p> You do not have permission to reset your password. </p>
                                            </Message>
                                        ) : (
                                            <>
                                                {this.state.error === 'user_not_found' ? (
                                                    <Message negative>
                                                        <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                                        <p> This E-Mail could not be found! </p>
                                                    </Message>
                                                ) : (
                                                    <div />
                                                )}

                                                {this.state.error === 'reset_error' ? (
                                                    <Message negative>
                                                        <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                                        <p> Please try again in a few minutes! </p>
                                                    </Message>
                                                ) : (
                                                    <div />
                                                )}

                                                {this.state.error === 'inputs_empty' ? (
                                                    <Message negative>
                                                        <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                                        <p> Please fill out everything! </p>
                                                    </Message>
                                                ) : (
                                                    <div />
                                                )}

                                                {this.state.error === 'mail_not_valid' ? (
                                                    <Message negative>
                                                        <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                                        <p>Your E-Mail Address does not look correct. Are you sure you entered it correctly?</p>
                                                    </Message>
                                                ) : (
                                                    <div />
                                                )}

                                                {this.state.success ? (
                                                    <Message positive>
                                                        <Message.Header>Please check your email inbox to reset your password.</Message.Header>
                                                    </Message>
                                                ) : (
                                                    <div />
                                                )}

                                                <form className="" onSubmit={this.handleSubmit}>
                                                    <Input fluid onChange={this.emailChangeHandler} autoComplete="email" type="email" placeholder="E-Mail" id="userEmail" />
                                                    <br />
                                                    {this.state.isResetting ? (
                                                        <Button loading primary type="submit">
                                                            Reset Password
                                                        </Button>
                                                    ) : (
                                                        <Button primary type="submit" onClick={this.handleSubmit}>
                                                            Reset Password
                                                        </Button>
                                                    )}
                                                </form>
                                            </>
                                        ))}
                                </div>
                            </>
                        )}

                        {this.state.showPinCard == '1' && (
                            <>
                                <div className="formContainer">
                                    <h3>Reset your WorkGroup Password</h3>

                                    {this.state.error === 'pin_incorrect' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> Your PIN is incorrect. Please try again! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    {this.state.error === 'already_registered' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> This E-Mail could not be found! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}
                                    {this.state.error === 'inputs_empty' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> Please fill out everything! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}
                                    {this.state.error === false ? (
                                        <Message positive>
                                            <Message.Header>Please check your email inbox and type in the PIN.</Message.Header>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    <form className="" onSubmit={this.handlePinSubmit}>
                                        <Input fluid onChange={this.pinChangeHandler} type="text" maxLength="6" placeholder="PIN" id="userPIN" />
                                        <br />
                                        {this.state.isResetting ? (
                                            <Button loading primary type="submit">
                                                Reset Password
                                            </Button>
                                        ) : (
                                            <Button primary type="submit" onClick={this.handlePinSubmit}>
                                                Reset Password
                                            </Button>
                                        )}
                                    </form>
                                </div>
                            </>
                        )}

                        {this.state.showPinCard == '2' && (
                            <>
                                <div className="formContainer">
                                    <h3>Reset your WorkGroup Password</h3>

                                    {this.state.error === 'pin_incorrect' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> Your PIN is incorrect. Please try again! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    {this.state.error === 'password_insecure' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> The Passwords are not secure. Please use a stronger password! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    {this.state.error === 'password_does_not_match' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> The Passwords does not match! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    {this.state.error === 'already_registered' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> This E-Mail could not be found! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}
                                    {this.state.error === 'inputs_empty' ? (
                                        <Message negative>
                                            <Message.Header>Oh no! An error occurred 😢.</Message.Header>
                                            <p> Please fill out everything! </p>
                                        </Message>
                                    ) : (
                                        <div />
                                    )}

                                    <form className="" onSubmit={this.handlePasswordSubmit}>
                                        <Input fluid onChange={this.password1ChangeHandler} type="password" autoComplete="new-password" placeholder="New Password" id="userPassword1" />
                                        <br />
                                        <Input fluid onChange={this.password2ChangeHandler} type="password" autoComplete="new-password" placeholder="Repeat your Password" id="userPassword2" />
                                        <br />
                                        {this.state.isResetting ? (
                                            <Button loading primary type="submit">
                                                Reset Password
                                            </Button>
                                        ) : (
                                            <Button primary type="submit" onClick={this.handlePasswordSubmit}>
                                                Reset Password
                                            </Button>
                                        )}
                                    </form>
                                </div>
                            </>
                        )}

                        {this.state.showPinCard == '3' && (
                            <>
                                <div className="formContainer">
                                    <h3>Reset your WorkGroup Password</h3>

                                    <Message positive>
                                        <Message.Header>Your Password has been changed!</Message.Header>
                                        <p> You can now Sign In with your new password! </p>
                                    </Message>

                                    <Button primary href="/">
                                        Sign In
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                </div>
                <div className="loginBackground"></div>
            </>
        )
    }
}
export default PasswordReset
