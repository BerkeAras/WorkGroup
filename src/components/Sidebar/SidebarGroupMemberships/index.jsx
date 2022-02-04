import React, { useEffect, useState } from 'react'
import './style.scss'
import { Placeholder, Icon } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import { Users } from 'react-feather'
import PropTypes from 'prop-types'

const SidebarGroupMemberships = (props) => {
    return (
        <div className="groups-container">
            <>
                {props.memberships.length == 0 ? (
                    <span className="empty-groups">You are not a member of any group.</span>
                ) : (
                    props.memberships.map((group) => {
                        return (
                            <Link key={`group-${group.group_id}`} className="group-item" to={`/app/group/` + group.group_id}>
                                <Users size={18} strokeWidth={2.7} /> {group.group_title}
                            </Link>
                        )
                    })
                )}
            </>
        </div>
    )
}

export default SidebarGroupMemberships
SidebarGroupMemberships.propTypes = {
    memberships: PropTypes.any,
}
