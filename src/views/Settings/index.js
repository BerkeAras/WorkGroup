import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { User as UserIcon, Mail, Eye, Shield } from 'react-feather'
import PropTypes from 'prop-types'
import './style.scss'
import AccountSettings from './AccountSettings'

const SettingsPage = () => {
    const [settings, setSettings] = useState('')

    useEffect(() => {
        document.title = 'Settings - WorkGroup'
    }, [])

    return (
        <>
            <Header />
            <div className="main_content settingsContainer">
                <h1>Settings</h1>
                <div className="settings-flex">
                    <SettingsList setSettings={setSettings} />
                    {settings === 'Account' ? (
                        <AccountSettings />
                    ) : settings === 'Mail' ? (
                        <MailSettings />
                    ) : settings === 'Privacy' ? (
                        <PrivacySettings />
                    ) : settings === 'Appearance' ? (
                        <AppearanceSettings />
                    ) : (
                        <SettingsDescription />
                    )}
                </div>
            </div>
        </>
    )
}

const SettingsList = (props) => {
    return (
        <div className="settings-list">
            <button onClick={() => props.setSettings('Account')}>
                <UserIcon size={20} strokeWidth={2.5} />
                Account Settings
            </button>
            <button onClick={() => props.setSettings('Mail')}>
                <Mail size={20} strokeWidth={2.5} />
                Mail Settings
            </button>
            <button onClick={() => props.setSettings('Privacy')}>
                <Shield size={20} strokeWidth={2.5} />
                Privacy Settings
            </button>
            <button onClick={() => props.setSettings('Appearance')}>
                <Eye size={20} strokeWidth={2.5} />
                Appearance Settings
            </button>
        </div>
    )
}

const MailSettings = () => {
    return <div className="settingsCont">M</div>
}

const PrivacySettings = () => {
    return <div className="settingsCont">P</div>
}

const AppearanceSettings = () => {
    return <div className="settingsCont">A</div>
}

const SettingsDescription = () => {
    return <div></div>
}

SettingsList.propTypes = {
    setSettings: PropTypes.func,
}

export default SettingsPage
