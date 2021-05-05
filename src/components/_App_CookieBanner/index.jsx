import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Button, Modal, Checkbox } from 'semantic-ui-react'
import { Info } from 'react-feather'
import './style.scss'

function CookieBanner() {
    const location = useLocation()

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

    const acceptCookies = (e) => {
        setCookiesAccepted(true)
        localStorage.setItem('cookies_accepted', 'true')
    }

    const initializeTracking = (location) => {
        if (process.env.REACT_APP_USE_GOOGLE_ANALYTICS == 'true') {
            ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS, {
                debug: false,
            })
            ReactGA.pageview(window.location.pathname)
        }
    }

    const saveCookieSettings = () => {
        if (analyticsCookiesChecked) {
            // Analytics cookies are checked
            initializeTracking(location)
            localStorage.setItem('cookies_accepted', 'true')
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
        }

        setCookiesAccepted(true)
        setShowCookieSettingsModal(false)
    }

    return (
        <>
            {cookiesAccepted == false && (
                <div className="cookie-banner">
                    <p>
                        <Info />
                        We use cookies to improve our products, personalise your feed and advertising and to analyse how our products are used.
                        <br />
                        Select &quot;Accept cookies&quot; to consent to this use or set your cookie selection under &quot;Manage settings&quot;. You can change your cookie settings at any time and
                        revoke your consent in your app-settings.
                    </p>

                    <Button onClick={acceptCookies} primary>
                        Accept cookies
                    </Button>
                    <Button onClick={() => setShowCookieSettingsModal(true)}>Manage settings</Button>
                </div>
            )}
            <Modal
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
            </Modal>
        </>
    )
}

export default CookieBanner
