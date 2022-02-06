import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { Modal, Message, Button, Form, Loader, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import AuthContext from '../../../store/AuthContext'
import W_Modal from '../../W_Modal'

export default function UserInformation(props) {
    const contextValue = useContext(AuthContext)

    const getDateTime = (date) => {
        let dateObject = new Date(date.replace(/-/g, '/'))
        let dd = String(dateObject.getDate()).padStart(2, '0')
        let mm = String(dateObject.getMonth() + 1).padStart(2, '0') //January is 0!
        let yyyy = dateObject.getFullYear()
        let hh = String(dateObject.getHours()).padStart(2, '0')
        let min = String(dateObject.getMinutes()).padStart(2, '0')

        dateObject = dd + '.' + mm + '.' + yyyy + ' / ' + hh + ':' + min
        return dateObject
    }

    return (
        props.member != null && (
            <W_Modal
                onClose={() => props.isOpenStateController(false)}
                onOpen={() => {
                    props.isOpenStateController(true)
                }}
                open={props.isOpenState}
                size="tiny"
            >
                <Modal.Header>User Information: {props.member.name}</Modal.Header>
                <Modal.Content>
                    <p>
                        <b>ID:</b> {props.member.id}
                        <br />
                        <b>Name:</b> {props.member.name}
                        <br />
                        <b>Email:</b> {props.member.email}
                        <br />
                        <b>Avatar:</b> {props.member.avatar}
                        <br />
                        <b>Banner:</b> {props.member.banner}
                        <br />
                        <b>Cookie Consent:</b> {props.member.cookie_choice == 'true' ? 'accepted' : 'technical only'}
                        <br />
                        <b>Account Activated:</b> {props.member.account_activated == 1 ? 'active' : 'inactive'}
                        <br />
                        <b>Activation Token:</b> {props.member.activation_token}
                        <br />
                        <b>Is Administrator:</b> {props.member.is_admin == 1 ? 'yes' : 'no'}
                        <br />
                        <b>Is Online:</b> {props.member.user_online == 1 ? 'yes' : 'no'}
                        <br />
                        <b>Last Online:</b> {getDateTime(props.member.user_last_online)}
                        <br />
                        <b>Last IP:</b> {props.member.user_last_ip}
                        <br />
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => props.isOpenStateController(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </W_Modal>
        )
    )
}

UserInformation.propTypes = {
    isOpenState: PropTypes.bool.isRequired,
    isOpenStateController: PropTypes.func.isRequired,
    member: PropTypes.any,
}
