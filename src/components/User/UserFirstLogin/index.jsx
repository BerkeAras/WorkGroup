import React, { useRef } from 'react'
import './style.scss'
import { Modal, Header, Button, Form, TextArea, Input, Dropdown } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import W_Modal from '../../W_Modal'

import unknownBanner from '../../../static/banner.jpg'
import unknownAvatar from '../../../static/unknown.png'
import countryOptions from '../../../utils/countries'

const notificationOptions = [
    { text: 'In App Message', key: 'inapp', value: 'inapp' },
    { text: 'E-Mail', key: 'email', value: 'email' },
]

class FirstLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banner: null,
            avatar: null,
            slogan: '',
            country: '',
            city: '',
            street: '',
            department: '',
            birthday: '',
            phone: '',
            isLoading: false,
            bannerPreviewUrl: unknownBanner,
            avatarPreviewUrl: unknownAvatar,
            notificationType: 'inapp',
        }

        this.handleSloganChange = this.handleSloganChange.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.handleStreetChange = this.handleStreetChange.bind(this)
        this.handleDepartmentChange = this.handleDepartmentChange.bind(this)
        this.handleBirthdayChange = this.handleBirthdayChange.bind(this)
        this.handlePhoneChange = this.handlePhoneChange.bind(this)
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleNotificationChange = this.handleNotificationChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        let bannerHeader = new Headers()
        bannerHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: bannerHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/user/getUserInformation`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.length > 0) {
                    this.setState({
                        birthday: res[0].user_birthday,
                        city: res[0].user_city,
                        country: res[0].user_country,
                        department: res[0].user_department,
                        phone: res[0].user_phone,
                        slogan: res[0].user_slogan,
                        street: res[0].user_street,
                        notificationType: res[0].notification_delivery_type,
                    })
                    if (res[0].banner !== '') {
                        this.setState({
                            bannerPreviewUrl: process.env.REACT_APP_API_URL + res[0].banner.replace('./static/', '/static/'),
                        })
                    }
                    if (res[0].avatar !== '') {
                        this.setState({
                            avatarPreviewUrl: process.env.REACT_APP_API_URL + res[0].avatar.replace('./static/', '/static/'),
                        })
                    }
                }
            })
    }

    bannerInputRef = React.createRef()
    avatarInputRef = React.createRef()

    bannerChange = (e) => {
        this.setState({ banner: e.target.files[0] })

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                bannerPreviewUrl: reader.result,
            })
        }

        reader.readAsDataURL(file)
    }

    avatarChange = (e) => {
        this.setState({ avatar: e.target.files[0] })

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                avatarPreviewUrl: reader.result,
            })
        }

        reader.readAsDataURL(file)
    }

    bannerUpload = () => {
        let element = document.querySelector('.setupForm')

        element = element.querySelector('input.bannerUpload').files[0]

        const formData = new FormData()
        formData.append('banner', element)

        let myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/user/uploadBanner`, {
            // Your POST endpoint
            method: 'POST',
            //mode: 'no-cors',
            headers: myHeaders,
            body: formData,
        })
    }

    avatarUpload = () => {
        let element = document.querySelector('.setupForm')

        element = element.querySelector('input.avatarUpload').files[0]

        const formData = new FormData()
        formData.append('avatar', element)

        let myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/user/uploadAvatar`, {
            // Your POST endpoint
            method: 'POST',
            //mode: 'no-cors',
            headers: myHeaders,
            body: formData,
        })
    }

    handleSloganChange(event) {
        this.setState({ slogan: event.target.value })
    }

    handleCityChange(event) {
        this.setState({ city: event.target.value })
    }

    handleStreetChange(event) {
        this.setState({ street: event.target.value })
    }

    handleDepartmentChange(event) {
        this.setState({ department: event.target.value })
    }

    handleBirthdayChange(event) {
        this.setState({ birthday: event.target.value })
    }

    handlePhoneChange(event) {
        this.setState({ phone: event.target.value })
    }

    handleCountryChange(e, { value }) {
        this.setState({ country: value })
    }

    handleNotificationChange(e, { value }) {
        this.setState({ notificationType: value })
    }

    handleSubmit(event) {
        event.preventDefault()

        this.setState({ isLoading: true })

        let inputs = document.querySelectorAll('.setupForm input')

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'submit') {
                inputs[i].disabled = 'disabled'
            }
        }

        // User Pictures

        if (this.state.banner !== null) {
            this.bannerUpload()
        }

        if (this.state.avatar !== null) {
            this.avatarUpload()
        }

        // User Information

        let slogan = this.state.slogan
        let country = this.state.country
        let city = this.state.city
        let street = this.state.street
        let department = this.state.department
        let birthday = this.state.birthday
        let phone = this.state.phone
        let notificationType = this.state.notificationType

        let formContent = [slogan, country, city, street, department, birthday, phone, notificationType]

        let myHeaders = new Headers()
        myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

        let urlencoded = new URLSearchParams()
        urlencoded.append('slogan', slogan)
        urlencoded.append('country', country)
        urlencoded.append('city', city)
        urlencoded.append('street', street)
        urlencoded.append('department', department)
        urlencoded.append('birthday', birthday)
        urlencoded.append('phone', phone)
        urlencoded.append('notificationType', notificationType)

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/user/setupUser', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                this.props.handleStateChange()

                this.setState({ isLoading: false })
            })
    }

    render() {
        const { file } = this.state
        return (
            <W_Modal className="first-login-modal" onClose={() => this.props.handleStateChange()} open={true} size="tiny">
                <Modal.Header>Set up your account</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Welcome to WorkGroup.</Header>
                        <p>Get started and set up your account. Start adding your slogan, your department and more.</p>
                    </Modal.Description>
                    <br />

                    <img src={this.state.bannerPreviewUrl} className="banner" onClick={() => this.bannerInputRef.current.click()} />
                    <img src={this.state.avatarPreviewUrl} className="avatar" onClick={() => this.avatarInputRef.current.click()} />

                    <Form className="setupForm">
                        <input ref={this.bannerInputRef} type="file" hidden onChange={this.bannerChange} className="bannerUpload" />
                        <input ref={this.avatarInputRef} type="file" hidden onChange={this.avatarChange} className="avatarUpload" />
                        <Form.Field>
                            <label>Your Slogan</label>
                            <TextArea value={this.state.slogan} onChange={this.handleSloganChange} placeholder="Tell us more about you" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Country</label>
                            <Dropdown placeholder="Select your Country" fluid search selection options={countryOptions} value={this.state.country} onChange={this.handleCountryChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Your City</label>
                            <Input value={this.state.city} onChange={this.handleCityChange} placeholder="Enter your City" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Street</label>
                            <Input value={this.state.street} onChange={this.handleStreetChange} placeholder="Enter your Street" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Department</label>
                            <Input value={this.state.department} onChange={this.handleDepartmentChange} placeholder="Enter your Department" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Birthday</label>
                            <Input type="date" value={this.state.birthday} onChange={this.handleBirthdayChange} placeholder="Enter your Birthday" />
                        </Form.Field>
                        <Form.Field>
                            <label>Your Phone</label>
                            <Input value={this.state.phone} onChange={this.handlePhoneChange} type="tel" placeholder="Enter your Phone" />
                        </Form.Field>
                        <Form.Field>
                            <label>Notification Type</label>
                            <Dropdown
                                placeholder="Select your Notification Type"
                                fluid
                                selection
                                options={notificationOptions}
                                value={this.state.notificationType}
                                onChange={this.handleNotificationChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button disabled={this.state.isLoading} loading={this.state.isLoading} color="black" onClick={() => this.props.handleStateChange()}>
                        Cancel
                    </Button>
                    {this.state.isLoading === true ? (
                        <Button
                            loading
                            content="Save"
                            labelPosition="right"
                            icon="checkmark"
                            //onClick={() => this.props.handleStateChange()}
                            positive
                        />
                    ) : (
                        <Button
                            content="Save"
                            labelPosition="right"
                            icon="checkmark"
                            //onClick={() => this.props.handleStateChange()}
                            onClick={this.handleSubmit}
                            positive
                        />
                    )}
                </Modal.Actions>
            </W_Modal>
        )
    }
}

export default FirstLogin

FirstLogin.propTypes = {
    handleStateChange: PropTypes.any,
}
