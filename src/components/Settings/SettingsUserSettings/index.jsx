import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Modal, Dropdown, Button, Form, TextArea, Input, Checkbox } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import AuthContext from '../../../store/AuthContext'
import countryOptions from '../../../utils/countries'
import W_Modal from '../../W_Modal'

export default function UserSettings(props) {
    const contextValue = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // User
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userResetAvatar, setUserResetAvatar] = useState(false)
    const [userResetBanner, setUserResetBanner] = useState(false)

    // User Information
    const [userBirthday, setUserBirthday] = useState('')
    const [userCity, setUserCity] = useState('')
    const [userCountry, setUserCountry] = useState('')
    const [userDepartment, setUserDepartment] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [userSlogan, setUserSlogan] = useState('')
    const [userStreet, setUserStreet] = useState('')

    // Administrative
    const [userIsActive, setUserIsActive] = useState(false)
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [userResetPassword, setUserResetPassword] = useState(false)
    const [userNewPassword, setUserNewPassword] = useState('')

    useEffect(() => {
        if (props.isOpenState) {
            setUserName(props.member.name)
            setUserEmail(props.member.email)
            setUserResetPassword(false)

            setUserBirthday(props.member.user_information.user_birthday)
            setUserCity(props.member.user_information.user_city)
            setUserCountry(props.member.user_information.user_country)
            setUserDepartment(props.member.user_information.user_department)
            setUserPhone(props.member.user_information.user_phone)
            setUserSlogan(props.member.user_information.user_slogan)
            setUserStreet(props.member.user_information.user_street)

            setUserIsAdmin(props.member.is_admin == 1 ? true : false)
            setUserIsActive(props.member.account_activated == 1 ? true : false)
        }
    }, [props])

    const getDateTime = (date) => {
        let dateObject = new Date(date.replace(/-/g, '/'))
        let dd = String(dateObject.getDate()).padStart(2, '0')
        let mm = String(dateObject.getMonth() + 1).padStart(2, '0') //January is 0!
        let yyyy = dateObject.getFullYear()
        let hh = String(dateObject.getHours()).padStart(2, '0')
        let min = String(dateObject.getMinutes()).padStart(2, '0')

        dateObject = dd + '.' + mm + '.' + yyyy + ' / ' + hh + ':' + min
        return dateObject
    }

    const handleCountryChange = (e, { value }) => {
        setUserCountry(value)
    }

    const handleSubmit = () => {
        setIsLoading(true)

        let data = {
            id: props.member.id,
            name: userName,
            email: userEmail,
            birthday: userBirthday,
            city: userCity,
            country: userCountry,
            department: userDepartment,
            phone: userPhone,
            slogan: userSlogan,
            street: userStreet,
            is_admin: userIsAdmin,
            account_activated: userIsActive,
            reset_password: userResetPassword,
            new_password: userNewPassword,
            reset_avatar: userResetAvatar,
            reset_banner: userResetBanner,
        }

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        fetch(`${process.env.REACT_APP_API_URL}/api/settings/user`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => {
                props.isOpenStateController(false)
                if (result.error == false) {
                    setErrorMessage('')
                    setShowSuccessModal(true)
                } else {
                    setErrorMessage(result.message)
                    setShowErrorModal(true)
                }
                setIsLoading(false)
            })
    }

    return (
        props.member != null && (
            <>
                <W_Modal
                    onClose={() => props.isOpenStateController(false)}
                    onOpen={() => {
                        props.isOpenStateController(true)
                    }}
                    open={props.isOpenState}
                    size="tiny"
                >
                    <Modal.Header>User Settings: {props.member.name}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <small className="user-settings-modal_small">User Profile Settings</small>
                            <Form.Field>
                                <label htmlFor="email">E-Mail</label>
                                <Input
                                    autoComplete="off"
                                    id="email"
                                    placeholder="Enter the E-Mail"
                                    value={userEmail}
                                    onChange={(e) => {
                                        setUserEmail(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="name">Name</label>
                                <Input
                                    autoComplete="off"
                                    id="name"
                                    placeholder="Enter the Name"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="slogan">Slogan</label>
                                <TextArea
                                    autoComplete="off"
                                    id="slogan"
                                    placeholder="Enter the Slogan"
                                    value={userSlogan}
                                    onChange={(e) => {
                                        setUserSlogan(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="country">Country</label>
                                <Dropdown
                                    autoComplete="off"
                                    if="country"
                                    placeholder="Select the Country"
                                    fluid
                                    search
                                    selection
                                    options={countryOptions}
                                    value={userCountry}
                                    onChange={handleCountryChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="city">City</label>
                                <Input
                                    autoComplete="off"
                                    id="city"
                                    placeholder="Enter the City"
                                    value={userCity}
                                    onChange={(e) => {
                                        setUserCity(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="street">Street</label>
                                <Input
                                    autoComplete="off"
                                    id="street"
                                    placeholder="Enter the Street"
                                    value={userStreet}
                                    onChange={(e) => {
                                        setUserStreet(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="department">Department</label>
                                <Input
                                    autoComplete="off"
                                    id="department"
                                    placeholder="Enter the Department"
                                    value={userDepartment}
                                    onChange={(e) => {
                                        setUserDepartment(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="birthday">Birthday</label>
                                <Input
                                    autoComplete="off"
                                    id="birthday"
                                    type="date"
                                    placeholder="Enter the Birthday"
                                    value={userBirthday}
                                    onChange={(e) => {
                                        setUserBirthday(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="phone">Phone</label>
                                <Input
                                    autoComplete="off"
                                    id="phone"
                                    placeholder="Enter the Phone"
                                    value={userPhone}
                                    onChange={(e) => {
                                        setUserPhone(e.target.value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    toggle
                                    checked={userResetAvatar}
                                    onChange={() => {
                                        setUserResetAvatar(!userResetAvatar)
                                    }}
                                    label="Reset Avatar to Default"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox
                                    toggle
                                    checked={userResetBanner}
                                    onChange={() => {
                                        setUserResetBanner(!userResetBanner)
                                    }}
                                    label="Reset Banner to Default"
                                />
                            </Form.Field>

                            {contextValue.id !== props.member.id && (
                                <>
                                    <br />

                                    <small className="user-settings-modal_small">Administrator Settings</small>
                                    <Form.Field>
                                        <Checkbox
                                            toggle
                                            checked={userIsAdmin}
                                            onChange={() => {
                                                setUserIsAdmin(!userIsAdmin)
                                            }}
                                            label="Administrator"
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox
                                            toggle
                                            checked={userIsActive}
                                            onChange={() => {
                                                setUserIsActive(!userIsActive)
                                            }}
                                            label="Account activated"
                                        />
                                    </Form.Field>

                                    <br />

                                    <small className="user-settings-modal_small">Password</small>
                                    <Form.Field>
                                        <Checkbox
                                            toggle
                                            checked={userResetPassword}
                                            onChange={() => {
                                                setUserResetPassword(!userResetPassword)
                                            }}
                                            label="Reset Password"
                                        />
                                    </Form.Field>

                                    {userResetPassword && (
                                        <Form.Field>
                                            <label htmlFor="password">New Password</label>
                                            <Input
                                                autoComplete="off"
                                                id="password"
                                                type="password"
                                                placeholder="Enter the new password"
                                                value={userNewPassword}
                                                onChange={(e) => {
                                                    setUserNewPassword(e.target.value)
                                                }}
                                            />
                                        </Form.Field>
                                    )}
                                </>
                            )}
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => props.isOpenStateController(false)}>
                            Cancel
                        </Button>
                        {isLoading === true ? (
                            <Button loading content="Save" labelPosition="right" icon="checkmark" positive />
                        ) : (
                            <Button onClick={handleSubmit} content="Save" labelPosition="right" icon="checkmark" positive />
                        )}
                    </Modal.Actions>
                </W_Modal>

                {showSuccessModal && (
                    <W_Modal onClose={() => setShowSuccessModal(false)} onOpen={() => setShowSuccessModal(true)} open={showSuccessModal} size="mini">
                        <Modal.Header>Your settings have been saved successfully!</Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={() => setShowSuccessModal(false)}>
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}

                {showErrorModal && (
                    <W_Modal onClose={() => setShowErrorModal(false)} onOpen={() => setShowErrorModal(true)} open={showErrorModal} size="mini">
                        <Modal.Header>An Error occurred!</Modal.Header>
                        <Modal.Content>{errorMessage}</Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={() => setShowErrorModal(false)}>
                                Dismiss
                            </Button>
                        </Modal.Actions>
                    </W_Modal>
                )}
            </>
        )
    )
}

UserSettings.propTypes = {
    isOpenState: PropTypes.bool.isRequired,
    isOpenStateController: PropTypes.func.isRequired,
    member: PropTypes.any,
}
