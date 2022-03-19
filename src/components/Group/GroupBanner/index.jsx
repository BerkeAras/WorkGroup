/* eslint-disable no-unreachable */
import React, { useEffect, useState, useRef } from 'react'
import './style.scss'
import { Button, Loader, Modal, Input, Checkbox, List } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { MoreVertical, Users, Zap } from 'react-feather'
import getFriendlyDate from '../../../utils/getFriendlyDate'
import { format } from 'date-fns'
import W_Modal from '../../W_Modal'

import unknownBanner from '../../../static/banner.jpg'
import unknownAvatar from '../../../static/unknown.png'

function GroupBanner(props) {
    const [background, setBackground] = useState(unknownBanner)
    const [avatar, setAvatar] = useState(unknownAvatar)
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('')
    const [isLoadingGroup, setIsLoadingGroup] = useState(true)
    const [isLoadingRequests, setIsLoadingRequests] = useState(true)
    const [showUserDropdown, setShowUserDropdown] = useState(false)
    const [showRequestsModal, setShowRequestsModal] = useState(false)
    const [showRequestActionModal, setShowRequestActionModal] = useState(false)
    const [showMembersModal, setShowMembersModal] = useState(false)

    const [editGroupModalOpen, setEditGroupModalOpen] = useState(false)
    const [isEditingGroup, setIsEditingGroup] = useState(false)

    const [groupTitleInput, setGroupTitleInput] = useState('')
    const [groupDescriptionInput, setGroupDescriptionInput] = useState('')
    const [groupPrivateCheckbox, setGroupPrivateCheckbox] = useState(false)

    const [groupTitleInputError, setGroupTitleInputError] = useState(false)
    const [groupDescriptionInputError, setGroupDescriptionInputError] = useState(false)

    const [groupBannerPreview, setGroupBannerPreview] = useState(unknownBanner)
    const [groupAvatarPreview, setGroupAvatarPreview] = useState(unknownAvatar)

    const [groupBannerUpload, setGroupBannerUpload] = useState(null)
    const [groupAvatarUpload, setGroupAvatarUpload] = useState(null)
    const bannerInputRef = useRef(null)
    const avatarInputRef = useRef(null)

    const [groupRequests, setGroupRequests] = useState([])
    const [groupRequestActionId, setGroupRequestActionId] = useState(null)
    const [groupMembers, setGroupMembers] = useState([])

    useEffect(() => {
        let groupInformation = props.groupInformation

        if (groupInformation.group_title !== undefined) {
            setIsLoadingGroup(false)

            setGroupTitleInput(props.groupInformation['group_title'])
            setGroupDescriptionInput(props.groupInformation['group_description'])
            setGroupPrivateCheckbox(props.groupInformation['group_private'] == 1 ? true : false)
        }

        if (groupInformation['group_banner'] != '' && groupInformation['group_banner'] != undefined) {
            setBackground(process.env.REACT_APP_API_URL + '/' + groupInformation['group_banner'].replace('./', ''))

            setGroupBannerPreview(process.env.REACT_APP_API_URL + '/' + groupInformation['group_banner'].replace('./', ''))
        }
        if (groupInformation['group_avatar'] != '' && groupInformation['group_avatar'] != undefined) {
            setAvatar(process.env.REACT_APP_API_URL + '/' + groupInformation['group_avatar'].replace('./', ''))

            setGroupAvatarPreview(process.env.REACT_APP_API_URL + '/' + groupInformation['group_avatar'].replace('./', ''))
        }

        const queryParams = new URLSearchParams(window.location.search)
        const requests = queryParams.get('requests')
        if (requests !== null) {
            setShowRequestsModal(true)
        }
    }, [props.groupInformation])

    const bannerChange = (e) => {
        setGroupBannerUpload(e.target.files[0])

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            setGroupBannerPreview(reader.result)
        }

        reader.readAsDataURL(file)
    }

    const avatarChange = (e) => {
        setGroupAvatarUpload(e.target.files[0])

        let reader = new FileReader()
        let file = e.target.files[0]

        reader.onloadend = () => {
            setGroupAvatarPreview(reader.result)
        }

        reader.readAsDataURL(file)
    }

    const handleDropdownBlur = (e) => {
        const currentTarget = e.currentTarget

        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                setShowUserDropdown(false)
            }
        }, 0)
    }

    const handleDropdownClick = (e) => {
        e.preventDefault()
        setShowRequestsModal(false)
        setShowUserDropdown(!showUserDropdown)
    }

    const handleRequestsModalClick = (e, props) => {
        e.preventDefault()
        setShowUserDropdown(false)
        setShowMembersModal(false)
        setShowRequestsModal(!showRequestsModal)
        loadRequests(props)
    }

    const handleMembersModalClick = (e, props) => {
        e.preventDefault()
        setShowUserDropdown(false)
        setShowRequestsModal(false)
        setShowMembersModal(!showMembersModal)
        loadMembers(props)
    }

    const handleSubmit = (props) => {
        setIsEditingGroup(true)

        if (groupTitleInput == '') {
            setGroupTitleInputError(true)
            setIsEditingGroup(false)
        } else {
            let avatarFile = avatarInputRef.current.files[0]
            let bannerFile = bannerInputRef.current.files[0]

            setGroupTitleInputError(false)
            setGroupDescriptionInputError(false)

            const formData = new FormData()

            if (groupBannerUpload !== null) {
                formData.append('banner', bannerFile)
            }
            if (groupAvatarUpload !== null) {
                formData.append('avatar', avatarFile)
            }

            formData.append('title', groupTitleInput)
            formData.append('description', groupDescriptionInput)
            formData.append('private', groupPrivateCheckbox)
            formData.append('group_id', props.groupInformation['id'])

            let headers = new Headers()
            headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            fetch(process.env.REACT_APP_API_URL + `/api/group/editGroup`, {
                // Your POST endpoint
                method: 'POST',
                headers: headers,
                body: formData,
            })
                .then((response) => response.json())
                .then((response) => {
                    location.reload()
                })
        }
    }

    const loadRequests = (props) => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        setIsLoadingRequests(true)

        fetch(process.env.REACT_APP_API_URL + '/api/group/getAllRequests?group_id=' + props.groupInformation['id'], requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == 1) {
                    setGroupRequests(result['requests'])
                } else {
                    setGroupRequests([])
                }

                setIsLoadingRequests(false)
            })
    }

    const loadMembers = (props) => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        setIsLoadingRequests(true)

        fetch(process.env.REACT_APP_API_URL + '/api/group/getAllMembers?group_id=' + props.groupInformation['id'], requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setGroupMembers(result['users'])
                setIsLoadingRequests(false)
            })
    }

    return (
        <div className="group-banner">
            <img
                onError={(e) => {
                    e.target.src = unknownBanner
                }}
                src={background}
                alt="Banner"
                className="banner-image"
            />

            <img
                onError={(e) => {
                    e.target.src = unknownAvatar
                }}
                src={avatar}
                alt="Avatar"
                className="user-avatar"
            />
            <br />

            {isLoadingGroup === true ? (
                <div className="banner-content banner-content-loading">
                    <Loader active>Loading group...</Loader>
                </div>
            ) : (
                <div className="banner-content">
                    <div className="banner-content-dropdown" onBlur={handleDropdownBlur}>
                        {props.groupInformation['is_admin'] == true && (
                            <>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        handleMembersModalClick(e, props)
                                    }}
                                    className="banner-content-dropdown-button"
                                >
                                    <Users size={20}></Users>
                                </a>
                                <a href="#" onClick={handleDropdownClick} className="banner-content-dropdown-button">
                                    <MoreVertical size={24}></MoreVertical>
                                </a>
                            </>
                        )}
                        {showUserDropdown && (
                            <div className="banner-content-dropdown-container">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setEditGroupModalOpen(true)
                                        setShowUserDropdown(false)
                                    }}
                                >
                                    Edit your Group
                                </a>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleRequestsModalClick(e, props)
                                    }}
                                >
                                    Group Requests
                                </a>
                            </div>
                        )}
                    </div>

                    <span className="user-name">{props.groupInformation['group_title']}</span>
                </div>
            )}

            {editGroupModalOpen && (
                <W_Modal
                    onClose={() => {
                        setEditGroupModalOpen(false)
                    }}
                    onOpen={() => {
                        setEditGroupModalOpen(true)
                    }}
                    open={editGroupModalOpen}
                    size="tiny"
                >
                    <Modal.Header>Edit your group</Modal.Header>
                    <Modal.Content style={{ position: 'relative', overflowX: 'hidden' }}>
                        <img src={groupBannerPreview} onClick={() => bannerInputRef.current.click()} className="create-group-modal-banner" />
                        <img src={groupAvatarPreview} onClick={() => avatarInputRef.current.click()} className="create-group-modal-avatar" />
                        <input ref={bannerInputRef} accept="image/*" type="file" hidden onChange={bannerChange} className="bannerUpload" />
                        <input ref={avatarInputRef} accept="image/*" type="file" hidden onChange={avatarChange} className="avatarUpload" />
                        <Input
                            error={groupTitleInputError}
                            fluid
                            onChange={(e) => {
                                setGroupTitleInputError(false)
                                setGroupTitleInput(e.target.value)
                            }}
                            value={groupTitleInput}
                            type="text"
                            placeholder="Title"
                        />
                        <br />
                        <Input
                            error={groupDescriptionInputError}
                            fluid
                            onChange={(e) => {
                                setGroupDescriptionInputError(false)
                                setGroupDescriptionInput(e.target.value)
                            }}
                            value={groupDescriptionInput}
                            type="text"
                            placeholder="Description"
                        />
                        <small className="create-group-modal-hint">Hint: use #hashtags to make your group better findable!</small>
                        <br />
                        <br />
                        <Checkbox
                            toggle
                            checked={groupPrivateCheckbox}
                            onChange={() => {
                                setGroupPrivateCheckbox(!groupPrivateCheckbox)
                            }}
                            label="Private Group"
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="black"
                            onClick={() => {
                                setEditGroupModalOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        {isEditingGroup ? (
                            <Button content="Save" labelPosition="right" icon="checkmark" positive loading />
                        ) : (
                            <Button
                                onClick={() => {
                                    handleSubmit(props)
                                }}
                                content="Save"
                                labelPosition="right"
                                icon="checkmark"
                                positive
                            />
                        )}
                    </Modal.Actions>
                </W_Modal>
            )}

            {showRequestsModal && (
                <W_Modal
                    onClose={() => {
                        setShowRequestsModal(false)
                    }}
                    onOpen={() => {
                        setShowRequestsModal(true)
                    }}
                    open={showRequestsModal}
                    size="tiny"
                    className="group-requests-modal"
                >
                    <Modal.Header>Group Requests</Modal.Header>
                    <Modal.Content>
                        {groupRequests.length > 0 ? (
                            groupRequests.map((request, index) => {
                                return (
                                    <List
                                        key={index}
                                        onClick={() => {
                                            setShowRequestActionModal(true)
                                            setGroupRequestActionId(request.id)
                                        }}
                                        divided
                                        relaxed
                                    >
                                        <List.Item>
                                            <List.Content>
                                                <List.Header as="a">{request.name}</List.Header>
                                                <List.Description as="a" title={format(new Date(request.created_at.replace(/-/g, '/')), 'dd.MM.yyyy - HH:mm:ss')}>
                                                    {getFriendlyDate(new Date(request.created_at.replace(/-/g, '/')))}
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                )
                            })
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>There are no Requests at the moment.</span>
                            </center>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="black"
                            onClick={() => {
                                setShowRequestsModal(false)
                            }}
                        >
                            Close
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}

            {showRequestActionModal && (
                <W_Modal
                    onClose={() => {
                        setShowRequestActionModal(false)
                        setGroupRequestActionId(null)
                    }}
                    onOpen={() => {
                        setShowRequestActionModal(true)
                    }}
                    open={showRequestActionModal}
                    size="mini"
                    className="group-requests-modal"
                >
                    <Modal.Header>Group Request</Modal.Header>
                    <Modal.Content>
                        {groupRequestActionId == null ? (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>This request could not be found.</span>
                            </center>
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>Do you want to approve this request?</span>
                                <br />
                                <br />
                                <Button href={`/app/group/${props.groupInformation['id']}/request/${groupRequestActionId}/rejected`} negative>
                                    No, reject.
                                </Button>
                                &nbsp;
                                <Button href={`/app/group/${props.groupInformation['id']}/request/${groupRequestActionId}/approved`} positive>
                                    Yes, approve.
                                </Button>
                            </center>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="black"
                            onClick={() => {
                                setShowRequestActionModal(false)
                                setGroupRequestActionId(null)
                            }}
                        >
                            Cancel
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}

            {showMembersModal && (
                <W_Modal
                    onClose={() => {
                        setShowMembersModal(false)
                    }}
                    onOpen={() => {
                        setShowMembersModal(true)
                    }}
                    open={showMembersModal}
                    size="tiny"
                    className="group-members-modal"
                >
                    <Modal.Header>Group Members</Modal.Header>
                    <Modal.Content>
                        {groupMembers ? (
                            groupMembers.map((member, index) => {
                                return (
                                    member.user && (
                                        <List key={index} divided relaxed>
                                            <List.Item href={`/app/user/${member.user.email}`}>
                                                <List.Content>
                                                    <div className="group-member-item-avatar">
                                                        <img
                                                            src={member.user.avatar}
                                                            alt=""
                                                            onError={(e) => {
                                                                e.target.src = unknownAvatar
                                                            }}
                                                        />
                                                    </div>
                                                    <List.Header as="a">{member.user.name}</List.Header>
                                                    <List.Description as="a" title={format(new Date(member.created_at.replace(/-/g, '/')), 'dd.MM.yyyy - HH:mm:ss')}>
                                                        Joined {getFriendlyDate(new Date(member.created_at.replace(/-/g, '/')))}
                                                    </List.Description>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    )
                                )
                            })
                        ) : (
                            <center>
                                <Zap size={35} strokeWidth={2} />
                                <br />
                                <span>There are no Members in this group.</span>
                            </center>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="black"
                            onClick={() => {
                                setShowMembersModal(false)
                            }}
                        >
                            Close
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
        </div>
    )
}

export default GroupBanner
GroupBanner.propTypes = {
    groupInformation: PropTypes.any,
}
