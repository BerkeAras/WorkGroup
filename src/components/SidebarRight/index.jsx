import React from 'react'
import './style.scss'
import { Card, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserFriends, faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import { User, Users, Calendar } from 'react-feather';

library.add(faUser, faUserFriends, faCalendarWeek)

class SidebarRight extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className="sidebar_right">
                <Card>
                    <Card.Content extra>My Account</Card.Content>
                    <Card.Content>
                        <Link className="card-item" to={'/app/user/' + localStorage.getItem('user_email')}>
                            <User size={20} strokeWidth={2.7} />
                            My Account
                        </Link>
                        <Link className="card-item" to="/my-account/friends">
                            <Users size={20} strokeWidth={2.7} />
                            Friends
                        </Link>
                        <Link className="card-item" to="/my-account/events">
                            <Calendar size={20} strokeWidth={2.7} />
                            Events
                        </Link>
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

export default SidebarRight
