import React from 'react'
import './style.scss'
import { Card, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserFriends, faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import { User, Users, Calendar } from 'react-feather'
import packageJson from '../../../package.json'
import logo from '../../static/logo.svg'

library.add(faUser, faUserFriends, faCalendarWeek)

const SidebarRight = () => {
    return (
        <div className="sidebar_right">
            <Card>
                <Card.Content extra>About WorkGroup {packageJson.version}</Card.Content>
                <Card.Content className="about-card-content">
                    <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup">
                        Project
                    </a>
                    &nbsp;–&nbsp;
                    <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup/blob/main/LICENSE">
                        License
                    </a>
                    &nbsp;–&nbsp;
                    <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup/blob/main/CONTRIBUTING.md">
                        Contributing
                    </a>
                    &nbsp;–&nbsp;
                    <a className="about-link" target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup#contact">
                        Contact
                    </a>
                </Card.Content>
                <Card.Content className="about-card-content">
                    <a target="_blank" rel="noreferrer" href="https://github.com/BerkeAras/WorkGroup" className="about-logo">
                        <img src={logo} />
                        <br />
                        an open source project.
                    </a>
                </Card.Content>
            </Card>
        </div>
    )
}

export default SidebarRight
