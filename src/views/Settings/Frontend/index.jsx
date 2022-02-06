/* eslint-disable no-useless-constructor */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Form, Input, Dropdown, Checkbox, Modal, Loader } from 'semantic-ui-react'
import './style.scss'
import locales from './locales.json'
import W_Modal from '../../../components/W_Modal'

function SettingsFrontend() {
    const [appName, setAppName] = useState('')
    const [appLogo, setAppLogo] = useState(process.env.REACT_APP_API_URL + '/static/' + 'default_logo.svg')
    const [appLogoPreview, setAppLogoPreview] = useState(appLogo)
    const [appLocale, setAppLocale] = useState('')
    const [appUrl, setAppUrl] = useState('')
    const [searchLength, setSearchLength] = useState(3)
    const [postsPerPage, setPostsPerPage] = useState(10)
    const [appRegistrationEnabled, setAppRegistrationEnabled] = useState('')
    const [appPasswordResetEnabled, setAppPasswordResetEnabled] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const appLogoImage = useRef(null)

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
        document.title = 'Frontend – Settings – WorkGroup'

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
                    if (settingsItem.config_key == 'app.name') {
                        setAppName(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'app.logo') {
                        setAppLogo(process.env.REACT_APP_API_URL + '/static/' + settingsItem.config_value)
                        setAppLogoPreview(process.env.REACT_APP_API_URL + '/static/' + settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'app.locale') {
                        setAppLocale(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'app.url') {
                        setAppUrl(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'app.minimum_search_length') {
                        setSearchLength(settingsItem.config_value)
                    }
                    if (settingsItem.config_key == 'app.maximum_posts_per_page') {
                        setPostsPerPage(settingsItem.config_value)
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const logoChange = (e) => {
        setAppLogo(e.target.files[0])

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            setAppLogoPreview(reader.result)
        }

        reader.readAsDataURL(file)
    }

    const logoUpload = () => {
        let element = document.querySelector('.settings_content .logoUpload').files[0]

        if (element == undefined) {
            // No new logo selected
            setIsLoading(false)
            setShowSuccessModal(true)
            return true
        }

        const formData = new FormData()
        formData.append('logoFile', element)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/settings/uploadLogo`, {
            // Your POST endpoint
            method: 'POST',
            //mode: 'no-cors',
            headers: headers,
            body: formData,
        })
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

    const saveFrontendSettings = () => {
        setIsLoading(true)

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        headers.append('Content-Type', 'application/json')

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'app.name': appName,
                'app.locale': appLocale,
                'app.url': appUrl,
                'app.minimum_search_length': searchLength,
                'app.maximum_posts_per_page': postsPerPage,
            }),
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/settings', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == '1') {
                    logoUpload()
                } else {
                    setShowErrorModal(true)
                }
            })
    }

    return (
        <>
            <div className="settings_content">
                <input
                    ref={appLogoImage}
                    accept="image/*"
                    type="file"
                    hidden
                    onChange={(e) => {
                        logoChange(e)
                    }}
                    className="logoUpload"
                />
                {isLoading ? (
                    <center className="settings_content_loader">
                        <Loader active>Loading Frontend Settings...</Loader>
                    </center>
                ) : (
                    <Form className="settings_content_form_frontend">
                        <Form.Field>
                            <label>App Logo</label>
                            <img src={appLogoPreview} className="settings_image_upload" onClick={() => appLogoImage.current.click()} />
                        </Form.Field>
                        <Form.Field>
                            <label>App Name</label>
                            <Input disabled={isLoading} value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="Enter the name of this WorkGroup App" />
                        </Form.Field>
                        <Form.Field>
                            <label>App Locale</label>
                            <Dropdown
                                disabled={isLoading}
                                placeholder="Select your country"
                                fluid
                                selection
                                options={locales}
                                value={appLocale}
                                onChange={(e, { value }) => {
                                    setAppLocale(value)
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Frontend URL</label>
                            <Input disabled={isLoading} type="url" value={appUrl} onChange={(e) => setAppUrl(e.target.value)} placeholder="Enter the URL of this WorkGroup App" />
                        </Form.Field>
                        <Form.Field>
                            <label>Minimum Search Length</label>
                            <Input min={1} disabled={isLoading} type="number" value={searchLength} onChange={(e) => setSearchLength(e.target.value)} placeholder="Minimum length to search" />
                        </Form.Field>
                        <Form.Field>
                            <label>Maximum Posts per Page</label>
                            <Input min={10} disabled={isLoading} type="number" value={postsPerPage} onChange={(e) => setPostsPerPage(e.target.value)} placeholder="Maximum Posts to show per Page" />
                        </Form.Field>
                        <br />
                        <Button loading={isLoading} type="button" onClick={saveFrontendSettings} primary>
                            Save settings
                        </Button>
                    </Form>
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

export default SettingsFrontend
