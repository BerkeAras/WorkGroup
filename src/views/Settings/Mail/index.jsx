/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Loader, Modal, Dropdown } from 'semantic-ui-react'
import './style.scss'
import W_Modal from '../../../components/W_Modal'

const EncryptionTypes = [
    {
        key: 'SSL',
        text: 'SSL',
        value: 'ssl',
    },
    {
        key: 'TLS',
        text: 'TLS',
        value: 'tls',
    },
    {
        key: 'STARTTLS',
        text: 'STARTTLS',
        value: 'starttls',
    },
]

function SettingsMail() {
    const [smtpHost, setSmtpHost] = useState('')
    const [smtpPort, setSmtpPort] = useState('')
    const [smtpUsername, setSmtpUsername] = useState('')
    const [smtpPassword, setSmtpPassword] = useState('')
    const [smtpEncryption, setSmtpEncryption] = useState('')
    const [smtpSenderEmail, setSmtpSenderEmail] = useState('')
    const [smtpSenderName, setSmtpSenderName] = useState('')

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
        document.title = 'Mail – Settings – WorkGroup'

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
                    if (settingsItem.config_key == 'server.smtp.host') {
                        setSmtpHost(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.port') {
                        setSmtpPort(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.username') {
                        setSmtpUsername(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.password') {
                        setSmtpPassword(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.encryption') {
                        setSmtpEncryption(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.from_address') {
                        setSmtpSenderEmail(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.smtp.from_name') {
                        setSmtpSenderName(settingsItem.config_value)
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const saveMailSettings = () => {
        setIsLoading(true)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'server.smtp.host': smtpHost,
                'server.smtp.port': smtpPort,
                'server.smtp.username': smtpUsername,
                'server.smtp.password': smtpPassword,
                'server.smtp.encryption': smtpEncryption,
                'server.smtp.from_address': smtpSenderEmail,
                'server.smtp.from_name': smtpSenderName,
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
                        <Loader active>Loading Mail Settings...</Loader>
                    </center>
                ) : (
                    <>
                        <Form>
                            <Form.Field>
                                <label>SMTP Hostname</label>
                                <Input disabled={isLoading} value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="Enter the Hostname of your SMTP-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Port</label>
                                <Input disabled={isLoading} value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="Enter the Port of your SMTP-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Username</label>
                                <Input disabled={isLoading} value={smtpUsername} onChange={(e) => setSmtpUsername(e.target.value)} placeholder="Enter the Username to access your SMTP-Server" />
                                <small>Your MySQL user needs all privileges on the database</small>
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Password</label>
                                <Input disabled={isLoading} value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="Enter the Password to access your SMTP-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Encryption</label>
                                <Dropdown
                                    disabled={isLoading}
                                    placeholder="Select the encryption type"
                                    fluid
                                    selection
                                    options={EncryptionTypes}
                                    value={smtpEncryption}
                                    onChange={(e, { value }) => {
                                        setSmtpEncryption(value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Sender E-Mail</label>
                                <Input disabled={isLoading} value={smtpSenderEmail} onChange={(e) => setSmtpSenderEmail(e.target.value)} placeholder="Specify the email you want to send from." />
                            </Form.Field>
                            <Form.Field>
                                <label>SMTP Sender Name</label>
                                <Input
                                    disabled={isLoading}
                                    value={smtpSenderName}
                                    onChange={(e) => setSmtpSenderName(e.target.value)}
                                    placeholder="Enter the name under which you would like to send."
                                />
                            </Form.Field>
                            <br />
                            <Button loading={isLoading} type="button" onClick={saveMailSettings} primary>
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

export default SettingsMail
