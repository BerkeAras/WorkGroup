/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Loader, Modal, Checkbox } from 'semantic-ui-react'
import './style.scss'
import W_Modal from '../../../components/W_Modal'

function SettingsAnalytics() {
    const [analyticsUseGoogleAnalytics, setAnalyticsUseGoogleAnalytics] = useState('')
    const [analyticsUseSentry, setAnalyticsUseSentry] = useState('')
    const [analyticsGoogleAnalyticsKey, setAnalyticsGoogleAnalyticsKey] = useState('')
    const [analyticsSentryDSN, setAnalyticsSentryDSN] = useState('')

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
        document.title = 'Analytics – Settings – WorkGroup'

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
                    if (settingsItem.config_key == 'analytics.google_analytics.enabled') {
                        setAnalyticsUseGoogleAnalytics(stringToBoolean(settingsItem.config_value))
                    }
                    if (settingsItem.config_key == 'analytics.sentry.enabled') {
                        setAnalyticsUseSentry(stringToBoolean(settingsItem.config_value))
                    }
                    if (settingsItem.config_key == 'analytics.google_analytics.key') {
                        setAnalyticsGoogleAnalyticsKey(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'analytics.sentry.dsn') {
                        setAnalyticsSentryDSN(settingsItem.config_value)
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
                'analytics.google_analytics.enabled': analyticsUseGoogleAnalytics.toString(),
                'analytics.sentry.enabled': analyticsUseSentry.toString(),
                'analytics.google_analytics.key': analyticsGoogleAnalyticsKey,
                'analytics.sentry.dsn': analyticsSentryDSN,
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
                        <Loader active>Loading Analytics Settings...</Loader>
                    </center>
                ) : (
                    <>
                        <Form>
                            <Form.Field>
                                <label>Google Analytics</label>
                                <Checkbox
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setAnalyticsUseGoogleAnalytics(!analyticsUseGoogleAnalytics)
                                    }}
                                    checked={stringToBoolean(analyticsUseGoogleAnalytics.toString())}
                                    toggle
                                    label="Do you want to use Google Analytics?"
                                />
                            </Form.Field>
                            {analyticsUseGoogleAnalytics == true ? (
                                <Form.Field>
                                    <label>Google Analytics Key</label>
                                    <Input disabled={isLoading} value={analyticsGoogleAnalyticsKey} onChange={(e) => setAnalyticsGoogleAnalyticsKey(e.target.value)} placeholder="UA-XXXXXXXXX-X" />
                                    <small>WorkGroup only works with Universal Analytics yet.</small>
                                </Form.Field>
                            ) : (
                                ''
                            )}
                            <Form.Field>
                                <label>Sentry Error Tracking</label>
                                <Checkbox
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        setAnalyticsUseSentry(!analyticsUseSentry)
                                    }}
                                    checked={stringToBoolean(analyticsUseSentry.toString())}
                                    toggle
                                    label="Do you want to use Sentry?"
                                />
                            </Form.Field>
                            {analyticsUseSentry == true ? (
                                <Form.Field>
                                    <label>Sentry DSN</label>
                                    <Input
                                        disabled={isLoading}
                                        value={analyticsSentryDSN}
                                        onChange={(e) => setAnalyticsSentryDSN(e.target.value)}
                                        placeholder="https://XXXXXXXXX.XXXXXXXXX.sentry.io/XXXXXXXXX"
                                    />
                                </Form.Field>
                            ) : (
                                ''
                            )}
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

export default SettingsAnalytics
