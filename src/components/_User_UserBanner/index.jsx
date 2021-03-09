import React, { useRef } from 'react'
import './style.scss'
import { Feed, Icon, Header, Loader, Button, Comment, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import unknownBanner from '../../static/banner.jpg'
import unknownAvatar from '../../static/unknown.png'

class UserBanner extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            background: unknownBanner,
            avatar: unknownAvatar,
        }
    }

    componentDidMount() {
        let email = this.props.email

        var bannerHeader = new Headers()
        bannerHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: bannerHeader,
            redirect: 'follow',
        }

        this.setState({ isLoading: true, error: undefined })
        fetch(process.env.REACT_APP_API_URL + `/api/user/getBanner?email=${email}`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res[0].banner != '') {
                    this.setState({ background: res[0].banner })
                }
                if (res[0].avatar != '') {
                    this.setState({ avatar: res[0].avatar })
                }
            })
    }

    render() {
        return (
            <div className="user-banner">
                <img className="banner-image" src={this.state.background} alt="Banner" />

                <img src={this.state.avatar} alt="Avatar" className="user-avatar" />
                <br />

                <div className="banner-content">
                    <span className="user-name">{localStorage.getItem('user_name')}</span>
                    <br />
                    <span className="user-email">{localStorage.getItem('user_email')}</span>
                </div>
            </div>
        )
    }
}

export default UserBanner

UserBanner.propTypes = {
    email: PropTypes.string,
}