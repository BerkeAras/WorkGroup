/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { Button, Form, Dropdown, Loader, Modal } from 'semantic-ui-react'
import './style.scss'
import W_Modal from '../../../components/W_Modal'

const qualityModes = [
    {
        key: 'min',
        value: 'min',
        code: 'min',
        text: 'Minimum (40% Quality)',
    },
    {
        key: 'medium',
        value: 'medium',
        code: 'medium',
        text: 'Medium (60% Quality)',
    },
    {
        key: 'max',
        value: 'max',
        code: 'max',
        text: 'Maximum (100% Quality / Lossless)',
    },
]

function SettingsOther() {
    const [otherAvatarQuality, setOtherAvatarQuality] = useState('')
    const [otherBannerQuality, setOtherBannerQuality] = useState('')
    const [otherPostImageQuality, setOtherPostImageQuality] = useState('')

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
        document.title = 'Authentication – Settings – WorkGroup'

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
                    if (settingsItem.config_key == 'other.avatar_quality') {
                        setOtherAvatarQuality(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'other.banner_quality') {
                        setOtherBannerQuality(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'other.post_image_quality') {
                        setOtherPostImageQuality(settingsItem.config_value)
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const saveOtherSettings = () => {
        setIsLoading(true)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'other.avatar_quality': otherAvatarQuality,
                'other.banner_quality': otherBannerQuality,
                'other.post_image_quality': otherPostImageQuality,
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
                        <Loader active>Loading Other Settings...</Loader>
                    </center>
                ) : (
                    <>
                        <Form>
                            <Form.Field>
                                <label>Avatar Quality</label>
                                <Dropdown
                                    disabled={isLoading}
                                    placeholder="Avatar Quality"
                                    fluid
                                    selection
                                    options={qualityModes}
                                    value={otherAvatarQuality}
                                    onChange={(e, { value }) => {
                                        setOtherAvatarQuality(value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Banner Quality</label>
                                <Dropdown
                                    disabled={isLoading}
                                    placeholder="Banner Quality"
                                    fluid
                                    selection
                                    options={qualityModes}
                                    value={otherBannerQuality}
                                    onChange={(e, { value }) => {
                                        setOtherBannerQuality(value)
                                    }}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Post Image Quality</label>
                                <Dropdown
                                    disabled={isLoading}
                                    placeholder="Post Image Quality"
                                    fluid
                                    selection
                                    options={qualityModes}
                                    value={otherPostImageQuality}
                                    onChange={(e, { value }) => {
                                        setOtherPostImageQuality(value)
                                    }}
                                />
                            </Form.Field>
                            <br />
                            <Button loading={isLoading} type="button" onClick={saveOtherSettings} primary>
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

export default SettingsOther
