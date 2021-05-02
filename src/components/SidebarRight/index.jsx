import React from 'react'
import './style.scss'
import { Card, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserFriends, faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'

library.add(faUser, faUserFriends, faCalendarWeek)

class SidebarRight extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className="sidebar_right">
                <Card>
                    <Card.Content extra>My Account</Card.Content>
                    <Card.Content>
                        <Link className="card-item" to="/my-account/">
                            <FontAwesomeIcon icon="user" />
                            My Account
                        </Link>
                        <Link className="card-item" to="/my-account/friends">
                            <FontAwesomeIcon icon="user-friends" />
                            Friends
                        </Link>
                        <Link className="card-item" to="/my-account/events">
                            <FontAwesomeIcon icon="calendar-week" />
                            Events
                        </Link>
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

export default SidebarRight
