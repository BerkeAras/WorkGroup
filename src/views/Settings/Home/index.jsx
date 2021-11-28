/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import './style.scss'

import { Monitor, Server, AtSign, BarChart2, Home, Zap } from 'react-feather'

function SettingsHome() {
    useEffect(() => {
        document.title = 'Settings – WorkGroup'
    }, [])

    return (
        <div className="settings_content">
            <center>
                <Zap size={35} strokeWidth={2} />
                <h1>Start configuring your WorkGroup intranet.</h1>
                <span>
                    You need help with the setup? Ask the{' '}
                    <a href="https://workgroup.berkearas.de/?utm_source=workgroup_instance&utm_medium=settings&utm_campaign=settings" rel="noreferrer" target="_blank">
                        community
                    </a>
                    !
                </span>
            </center>
        </div>
    )
}

export default SettingsHome
