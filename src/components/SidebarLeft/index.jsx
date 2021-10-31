import React, { useEffect, useState } from 'react'
import packageJson from '../../../package.json'
import './style.scss'
import SidebarPopularItems from '../SidebarPopularItems'
import SidebarGroupMemberships from '../SidebarGroupMemberships'
import { Card } from 'semantic-ui-react'
import logo from '../../static/logo.svg'

const SidebarLeft = () => {
    const [groupMemberships, setGroupMemberships] = useState([])

    useEffect(() => {
        var userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/group/getGroupMemberships`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 1) {
                    setGroupMemberships(res['groups'])
                }
            })
    }, [])

    return (
        <div className="sidebar_left">
            <Card>
                <Card.Content extra>Popular Topics</Card.Content>
                <Card.Content>
                    <SidebarPopularItems />
                </Card.Content>
            </Card>
            {groupMemberships.length > 0 && (
                <Card>
                    <Card.Content extra>My Groups</Card.Content>
                    <Card.Content>
                        <SidebarGroupMemberships memberships={groupMemberships} />
                    </Card.Content>
                </Card>
            )}
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
