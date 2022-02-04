import React, { useEffect, useState } from 'react'
import './style.scss'
import { Card, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserFriends, faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import packageJson from '../../../../package.json'
import logo from '../../../static/logo.svg'
import CookieBanner from '../../App/AppCookieBanner'

library.add(faUser, faUserFriends, faCalendarWeek)

const SidebarRight = () => {
    const [showCookieBanner, setShowCookieBanner] = useState(false)

    return (
        <>
            <div className="sidebar_right">
                <Card>
                    <Card.Content extra>About WorkGroup {packageJson.version}</Card.Content>
                    <Card.Content className="about-card-content">
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://workgroup.berkearas.de/">
                            Project
                        </a>
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup/blob/main/LICENSE">
                            License
                        </a>
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup/blob/main/CONTRIBUTING.md">
                            Contributing
                        </a>
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup#contact">
                            Contact
                        </a>
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://workgroup.berkearas.de/imprint">
                            Imprint
                        </a>
                        <a className="about-link" target="_blank" rel="noreferrer" href="https://workgroup.berkearas.de/data-policy">
                            Data Policy
                        </a>
                        <a
                            className="about-link"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                localStorage.removeItem('cookies_accepted')
                                setShowCookieBanner(true)
                            }}
                        >
                            Cookie Consent
                        </a>
                    </Card.Content>
                    <Card.Content className="about-card-content">
                        <a target="_blank" rel="noreferrer" href="https://workgroup.berkearas.de/" className="about-logo">
                            <img src={logo} />
                            <br />
                            an open source project.
                        </a>
                    </Card.Content>
                </Card>
            </div>

            {showCookieBanner && <CookieBanner isLoggedIn={true} />}
        </>
    )
}

export default SidebarRight
