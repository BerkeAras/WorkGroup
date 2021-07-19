import React from 'react'
import packageJson from '../../../package.json'
import './style.scss'
import SidebarPopularItems from '../SidebarPopularItems'
import { Card } from 'semantic-ui-react'
import logo from '../../static/logo.svg'

const SidebarLeft = () => {
    return (
        <div className="sidebar_left">
            <Card>
                <Card.Content extra>Popular Topics</Card.Content>
                <Card.Content>
                    <SidebarPopularItems />
                </Card.Content>
            </Card>
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

export default SidebarLeft
