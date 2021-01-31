import React from 'react'
import './style.scss'
import SidebarPopularItems from '../SidebarPopularItems'
import { Card } from 'semantic-ui-react'

class Sidebar extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <Card>
                <Card.Content extra>Popular Topics</Card.Content>
                <Card.Content>
                    <SidebarPopularItems />
                </Card.Content>
            </Card>
        )
    }
}

export default Sidebar
