import React from 'react'
import './style.scss'
import { Card, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faUserFriends, faCalendarWeek } from "@fortawesome/free-solid-svg-icons";

library.add(faUser, faUserFriends, faCalendarWeek);

class SidebarRight extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className="sidebar_right">
                <Card>
                    <Card.Content extra>My Account</Card.Content>
                    <Card.Content>
                        <a className="card-item" href="/my-account/">
                            <FontAwesomeIcon icon="user" />
                            My Account
                        </a>
                        <a className="card-item" href="/my-account/friends">
                            <FontAwesomeIcon icon="user-friends" />
                            Friends
                        </a>
                        <a className="card-item" href="/my-account/events">
                            <FontAwesomeIcon icon="calendar-week" />
                            Events
                        </a>
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

export default SidebarRight;
