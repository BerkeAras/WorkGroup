/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Loader, Modal, Message } from 'semantic-ui-react'
import './style.scss'
import W_Modal from '../../../components/W_Modal'

function SettingsServer() {
    const [mysqlHost, setMysqlHost] = useState('')
    const [mysqlPort, setMysqlPort] = useState('')
    const [mysqlUsername, setMysqlUsername] = useState('')
    const [mysqlPassword, setMysqlPassword] = useState('')
    const [mysqlDatabase, setMysqlDatabase] = useState('')

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
        document.title = 'Server – Settings – WorkGroup'

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
                    if (settingsItem.config_key == 'server.database.host') {
                        setMysqlHost(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.database.port') {
                        setMysqlPort(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.database.username') {
                        setMysqlUsername(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.database.password') {
                        setMysqlPassword(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'server.database.name') {
                        setMysqlDatabase(settingsItem.config_value)
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const saveServerSettings = () => {
        setIsLoading(true)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'server.database.host': mysqlHost,
                'server.database.port': mysqlPort,
                'server.database.username': mysqlUsername,
                'server.database.password': mysqlPassword,
                'server.database.name': mysqlDatabase,
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
                        <Loader active>Loading Server Settings...</Loader>
                    </center>
                ) : (
                    <>
                        <Message warning>
                            <Message.Header>Warning!</Message.Header>
                            <p>Editing the server settings may cause a loss of connection to the WorkGroup server or database!</p>
                        </Message>

                        <Form>
                            <Form.Field>
                                <label>MySQL Hostname</label>
                                <Input disabled={isLoading} value={mysqlHost} onChange={(e) => setMysqlHost(e.target.value)} placeholder="Enter the Hostname of your MySQL-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>MySQL Port</label>
                                <Input disabled={isLoading} value={mysqlPort} onChange={(e) => setMysqlPort(e.target.value)} placeholder="Enter the Port of your MySQL-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>MySQL Username</label>
                                <Input disabled={isLoading} value={mysqlUsername} onChange={(e) => setMysqlUsername(e.target.value)} placeholder="Enter the Username to access your MySQL-Server" />
                                <small>Your MySQL user needs all privileges on the database</small>
                            </Form.Field>
                            <Form.Field>
                                <label>MySQL Password</label>
                                <Input disabled={isLoading} value={mysqlPassword} onChange={(e) => setMysqlPassword(e.target.value)} placeholder="Enter the Password to access your MySQL-Server" />
                            </Form.Field>
                            <Form.Field>
                                <label>MySQL Database Name</label>
                                <Input disabled={isLoading} value={mysqlDatabase} onChange={(e) => setMysqlDatabase(e.target.value)} placeholder="Enter the Name of your MySQL Database" />
                            </Form.Field>
                            <br />
                            <Button loading={isLoading} type="button" onClick={saveServerSettings} primary>
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

export default SettingsServer
