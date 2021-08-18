import React, { useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import ErrorMsg from '../../components/ErrMsgCont'
import './style.scss'

const AccountSettings = () => {
    return (
        <div className="settingsCont">
            <h2>Account Settings</h2>
            <h3>Change Password</h3>
            <NewPassword />
        </div>
    )
}

const NewPassword = () => {
    const [currentPassword, setCurrentPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [newPasswordRepeat, setNewPasswordRepeat] = useState()
    const [errMsg, setErrMsg] = useState()

    const submitPassword = () => {
        if (newPassword !== newPasswordRepeat) {
            setErrMsg('Passwords dont match')
            return
        }

        //fetch if password is right and change it
    }

    return (
        <div>
            <Form>
                <Form.Field>
                    <Input onChange={(e) => setCurrentPassword(e.target.value)} placeholder="current password" required />
                </Form.Field>
                <Form.Field>
                    <Input onChange={(e) => setNewPassword(e.target.value)} placeholder="new password" required />
                </Form.Field>
                <Form.Field>
                    <Input onChange={(e) => setNewPasswordRepeat(e.target.value)} placeholder="repeat new password" required />
                </Form.Field>
                {errMsg ? <ErrorMsg errorMsg={errMsg} /> : null}
                <Button primary type="submit" onClick={submitPassword}>
                    Change Password
                </Button>
            </Form>
        </div>
    )
}

export default AccountSettings
