import React, { useEffect, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Button, Modal, Checkbox } from 'semantic-ui-react'
import { Info } from 'react-feather'
import './style.scss'
import ConfigContext from '../../../store/ConfigContext'
import W_Modal from '../../W_Modal'

function CookieBanner(props) {
    const location = useLocation()
    const contextValue = useContext(ConfigContext)

    const [cookiesAccepted, setCookiesAccepted] = useState(false)
    const [showCookieSettingsModal, setShowCookieSettingsModal] = useState(false)
    const [analyticsCookiesChecked, setAnalyticsCookiesChecked] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('cookies_accepted') == 'true') {
            setCookiesAccepted(true)
            initializeTracking(location)
        } else if (localStorage.getItem('cookies_accepted') == 'technical') {
            setCookiesAccepted(true)
        }
    })

    const storeCookieChoice = () => {
        if (props.isLoggedIn) {
            let header = new Headers()
            header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
            header.append('Content-Type', 'application/json')

            const requestOptions = {
                method: 'POST',
                headers: header,
                body: JSON.stringify({
                    cookie_choice: localStorage.getItem('cookies_accepted'),
                }),
            }
            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/user/storeCookieChoice', requestOptions)
        }
    }

    const acceptCookies = (e) => {
        setCookiesAccepted(true)
        localStorage.setItem('cookies_accepted', 'true')
        storeCookieChoice()
    }

    const initializeTracking = (location) => {
        if (contextValue != undefined) {
            if (contextValue.analytics.google_analytics_enabled == 'true') {
                ReactGA.initialize(contextValue.analytics.google_analytics_key, {
                    debug: false,
                })
                ReactGA.pageview(window.location.pathname)
            }
        }
    }

    const saveCookieSettings = () => {
        if (analyticsCookiesChecked) {
            // Analytics cookies are checked
            initializeTracking(location)
            localStorage.setItem('cookies_accepted', 'true')
            storeCookieChoice()
        } else {
            // Remove cookies
            document.cookie = '_ga=; Path=/; Domain=.example.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            document.cookie = '_gat=; Path=/; Domain=.example.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
            document.cookie = '_gid=; Path=/; Domain=.example.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'

            // Remove G-Analytics
            if (document.querySelector('script[src="https://www.google-analytics.com/analytics.js"]')) {
                document.querySelector('script[src="https://www.google-analytics.com/analytics.js"]').remove()
            }

            localStorage.removeItem('cookies_accepted')
            localStorage.setItem('cookies_accepted', 'technical')
            storeCookieChoice()
        }

        setCookiesAccepted(true)
        setShowCookieSettingsModal(false)
    }

    return (
        <>
            {contextValue != undefined &&
                contextValue.analytics != undefined &&
                (contextValue.analytics.google_analytics_enabled == 'true' || contextValue.analytics.google_analytics_enabled == true) && (
                    <>
                        {cookiesAccepted == false && (
                            <div className="cookie-banner">
                                <p>
                                    <Info />
                                    We use cookies to improve our products, personalise your feed and advertising and to analyse how our products are used.
                                    <br />
                                    Select &quot;Accept cookies&quot; to consent to this use or set your cookie selection under &quot;Manage settings&quot;. You can change your cookie settings at any
                                    time and revoke your consent in your app-settings.
                                </p>

                                <Button onClick={acceptCookies} primary>
                                    Accept cookies
                                </Button>
                                <Button onClick={() => setShowCookieSettingsModal(true)}>Manage settings</Button>
                            </div>
                        )}
                    </>
                )}
            {showCookieSettingsModal && (
                <W_Modal
                    className="cookie-modal"
                    onClose={() => {
                        setShowCookieSettingsModal(false)
                    }}
                    onOpen={() => setShowCookieSettingsModal(true)}
                    open={showCookieSettingsModal}
                    size="tiny"
                >
                    <Modal.Header>Manage your cookie settings</Modal.Header>
                    <Modal.Content>
                        We use cookies for advertising, analysis and to improve our features and products. You can use the &quot;Accept all cookies&quot; button to agree to cookies or adjust your
                        selection.
                        <br />
                        <div className="cookie-explenation">
                            <Checkbox toggle label="Technical cookies" defaultChecked disabled />
                            <br />
                            <p>Technical cookies are required for proper functionality of our products &amp; services.</p>
                        </div>
                        <div className="cookie-explenation">
                            <Checkbox
                                toggle
                                checked={analyticsCookiesChecked}
                                onChange={() => {
                                    setAnalyticsCookiesChecked(!analyticsCookiesChecked)
                                }}
                                label="Analysis cookies"
                            />
                            <br />
                            <p>With analytics cookies we try to improve our products &amp; services by better understanding users &amp; how they interact with services.</p>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            onClick={() => {
                                setShowCookieSettingsModal(false)
                            }}
                        >
                            Dismiss
                        </Button>
                        <Button primary onClick={saveCookieSettings}>
                            Save settings
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
        </>
    )
}

export default CookieBanner

CookieBanner.propTypes = {
    isLoggedIn: PropTypes.any,
}
