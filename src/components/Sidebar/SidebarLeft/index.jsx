import React, { useEffect, useState } from 'react'
import packageJson from '../../../../package.json'
import './style.scss'
import SidebarPopularItems from '../SidebarPopularItems'
import SidebarGroupMemberships from '../SidebarGroupMemberships'
import { Card } from 'semantic-ui-react'

const SidebarLeft = () => {
    const [groupMemberships, setGroupMemberships] = useState([])

    useEffect(() => {
        let userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
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
        </div>
    )
}

export default SidebarLeft
