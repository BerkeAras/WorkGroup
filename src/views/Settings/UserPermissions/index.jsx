/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Loader, Modal, Checkbox } from 'semantic-ui-react'
import './style.scss'
import W_Modal from '../../../components/W_Modal'

function SettingsUserPermissions() {
    const [appRegistrationEnabled, setAppRegistrationEnabled] = useState('')
    const [appPasswordResetEnabled, setAppPasswordResetEnabled] = useState('')
    const [appGroupCreationEnabled, setAppGroupCreationEnabled] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const stringToBoolean = (string) => {
        switch (string.toLowerCase().trim()) {
            case 'true':
            case 'yes':
            case '1':
                return true
            case 'false':
            case 'no':
            case '0':
            case null:
                return false
            default:
                return Boolean(string)
        }
    }

    useEffect(() => {
        document.title = 'User Permissions – Settings – WorkGroup'

        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/settings', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)
                result.forEach((settingsItem) => {
                    if (settingsItem.config_key == 'app.registration_enabled') {
                        setAppRegistrationEnabled(stringToBoolean(settingsItem.config_value))
                    }
                    if (settingsItem.config_key == 'app.password_reset_enabled') {
                        setAppPasswordResetEnabled(stringToBoolean(settingsItem.config_value))
                    }
                    if (settingsItem.config_key == 'app.group_creation_enabled') {
                        setAppGroupCreationEnabled(stringToBoolean(settingsItem.config_value))
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const saveAnalyticsSettings = () => {
        setIsLoading(true)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'app.registration_enabled': appRegistrationEnabled.toString(),
                'app.password_reset_enabled': appPasswordResetEnabled.toString(),
                'app.group_creation_enabled': appGroupCreationEnabled.toString(),
            }),
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/settings', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == '1') {
                    setIsLoading(false)
                    setShowSuccessModal(true)
                } else {
                    setShowErrorModal(true)
                }
            })
    }

    return (
        <>
            <div className="settings_content">
                {isLoading ? (
                    <center className="settings_content_loader">
                        <Loader active>Loading User Permissions Settings...</Loader>
                    </center>
                ) : (
                    <>
                        <Form>
                            <Form.Field>
                                <label>Registration enabled</label>
                                <Checkbox
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setAppRegistrationEnabled(!appRegistrationEnabled)
                                    }}
                                    checked={stringToBoolean(appRegistrationEnabled.toString())}
                                    toggle
                                    label="Can users sign up?"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Password reset enabled</label>
                                <Checkbox
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setAppPasswordResetEnabled(!appPasswordResetEnabled)
                                    }}
                                    checked={stringToBoolean(appPasswordResetEnabled.toString())}
                                    toggle
                                    label="Can users reset their passwords?"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Group creation enabled</label>
                                <Checkbox
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setAppGroupCreationEnabled(!appGroupCreationEnabled)
                                    }}
                                    checked={stringToBoolean(appGroupCreationEnabled.toString())}
                                    toggle
                                    label="Can users create new groups?"
                                />
                            </Form.Field>
                            <br />
                            <Button loading={isLoading} type="button" onClick={saveAnalyticsSettings} primary>
                                Save settings
                            </Button>
                        </Form>
                    </>
                )}
            </div>

            {showSuccessModal && (
                <W_Modal onClose={() => setShowSuccessModal(false)} onOpen={() => setShowSuccessModal(true)} open={showSuccessModal} size="mini">
                    <Modal.Header>Your settings have been saved successfully!</Modal.Header>
                    <Modal.Content>To apply all settings, please reload this page.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setShowSuccessModal(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
            {showErrorModal && (
                <W_Modal onClose={() => setShowErrorModal(false)} onOpen={() => setShowErrorModal(true)} open={showErrorModal} size="mini">
                    <Modal.Header>Your settings could not be saved!</Modal.Header>
                    <Modal.Content>An error has occurred. Please contact your administrator.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setShowErrorModal(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
        </>
    )
}

export default SettingsUserPermissions
