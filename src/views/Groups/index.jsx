/* eslint-disable no-useless-constructor */
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Popup, Modal, Input, Checkbox } from 'semantic-ui-react';
import { Hash } from 'react-feather'
import unknownAvatar from '../../static/unknown.png'
import unknownBanner from '../../static/banner.jpg'

// Components
import Header from '../../components/Header'

function Groups() {

    const [groupsList, setGroupsList] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);
    const [groupTitleInput, setGroupTitleInput] = useState("");
    const [groupDescriptionInput, setGroupDescriptionInput] = useState("");
    const [groupPrivateCheckbox, setGroupPrivateCheckbox] = useState(false);
    const [groupBannerPreview, setGroupBannerPreview] = useState(unknownBanner);
    const [groupAvatarPreview, setGroupAvatarPreview] = useState(unknownAvatar);
    const [groupBannerUpload, setGroupBannerUpload] = useState(null);
    const [groupAvatarUpload, setGroupAvatarUpload] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const bannerInputRef = useRef(null)
    const avatarInputRef = useRef(null)

    useEffect(() => {
        document.title = 'Loading groups... – WorkGroup'

        var userInformationHeader = new Headers()
        userInformationHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        var requestOptions = {
            method: 'GET',
            headers: userInformationHeader,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + `/api/group/getGroups`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setGroupsList(res["groups"])
                    if (res['group_count'] == 1) {
                        document.title = '1 Group found – WorkGroup'
                    } else {
                        document.title = res['group_count'] + ' Groups found – WorkGroup'
                    }
                }
            })
        
        fetch(process.env.REACT_APP_API_URL + `/api/group/getTags`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setTagsList(res)
                }
            })
    }, [])

    const joinGroup = (groupId) => {
        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                id: groupId,
            }),
        }

        fetch(process.env.REACT_APP_API_URL + '/api/group/joinGroup', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status == "approved") {
                    window.location.href = '/app/group-request-approved';
                } else {
                    window.location.href = '/app/group-request-pending';
                }
            })
    }

    const createGroupModal = () => {
        console.log('createGroupModal');
    }

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
    
    const handleSubmit = () => {

        setIsCreatingGroup(true);

        let avatarFile = avatarInputRef.current.files[0]
        let bannerFile = avatarInputRef.current.files[0]

        const formData = new FormData()

        if (groupBannerUpload !== null) {
            formData.append('banner', bannerFile);
        }
        if (groupAvatarUpload !== null) {
            formData.append('avatar', avatarFile);
        }

        formData.append('title', groupTitleInput);
        formData.append('description', groupDescriptionInput);
        formData.append('private', groupPrivateCheckbox);

        let headers = new Headers()
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        fetch(process.env.REACT_APP_API_URL + `/api/group/createGroup`, {
            // Your POST endpoint
            method: 'POST',
            headers: headers,
            body: formData,
        })
            .then(response => response.json())
            .then((response) => {
                console.log(response);
                if (response.status == 0) {
                    setErrorModalOpen(true);
                } else {
                    window.location.href = "/app/group/" + response.group_id;
                }
            })
    }

    return (
        <div className="app">
            <Header />

            <Modal
                onClose={() => {
                    setErrorModalOpen(false)
                    window.location.reload();
                }}
                onOpen={() => {setErrorModalOpen(true)}}
                open={errorModalOpen}
                size="mini"
            >
                <Modal.Header>Group could not be created!</Modal.Header>
                <Modal.Content>Your post could not be created to a server error! We are working to fix this bug.</Modal.Content>
                <Modal.Actions>
                    <Button
                        color="black"
                        onClick={() => {
                            setErrorModalOpen(false)
                            window.location.reload();
                        }}
                    >
                        Dismiss
                    </Button>
                </Modal.Actions>
            </Modal>

            <div className="main_content">
                <div className="groups-content">
                    <div className="group-topics">
                        <Button onClick={() => {setCreateGroupModalOpen(true)}} fluid primary>Create a group</Button><br />
                        {tagsList.length > 0 && (
                            tagsList.map((tag) => {
                                return (
                                    <Link key={tag.id} className="group-topics-item" to={`/app/groups/${tag.id}`}>
                                        <Hash size={18} strokeWidth={2.7} /> {tag.tag}
                                    </Link>
                                )
                            })
                        )}
                    </div>
                    <div className="group-list">

                        {groupsList.length > 0 && (
                            groupsList.map((group) => {
                                return (
                                    <div key={group.id} className="group-list-item">
                                        <img className="group-list-item-banner" src={group.group_banner} onError={(e) => {e.target.src = unknownBanner }} alt="" />
                                        <img className="group-list-item-avatar" src={group.group_avatar} onError={(e) => {e.target.src = unknownAvatar }} alt="" />
    
                                        <div className="group-list-item-content">
                                            <span className="group-list-item-title">{group.group_title} <small className="group-list-item-members">{group.member_count} Member{(group.member_count !== 1) && (<>s</>)}</small></span><br />
                                            <p className="group-list-item-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus non repudiandae nobis debitis corrupti nihil dignissimos quam laborum, nostrum qui illo dicta alias iure facere nam? Odio cupiditate quasi deserunt!</p>
                                            <br />
                                            {(group.isInGroup === true) ? (
                                                <Popup
                                                    trigger={
                                                        <Button size="small" primary>
                                                            Join{(group.group_private == 1) && (<> private</>)} group
                                                        </Button>
                                                    }
                                                    content="You are already in this group"
                                                    position="bottom left"
                                                />
                                            ) : (
                                                (group.hasAlreadyRequested === true) ? (
                                                    <Popup
                                                        trigger={
                                                            <Button size="small" primary>
                                                                Join{(group.group_private == 1) && (<> private</>)} group
                                                            </Button>
                                                        }
                                                        content="You already requested to join this group"
                                                        position="bottom left"
                                                    />
                                                ) : (
                                                    <Button onClick={(e) => {
                                                        joinGroup(group.id);
                                                        e.target.classList.add('loading')
                                                        e.target.disabled = true;
                                                    }} size="small" primary>
                                                        Join{(group.group_private == 1) && (<> private</>)} group
                                                    </Button>
                                                )
                                            )}
                                            <Link component={Button} to={`/app/group/${group.id}`} size="small">
                                                Visit group
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        )}


                    </div>

                </div>
            </div>

            <Modal
                onClose={() => {setCreateGroupModalOpen(false)}}
                onOpen={() => {
                    setCreateGroupModalOpen(true)
                }}
                open={createGroupModalOpen}
                size="tiny"
            >
                <Modal.Header>Create a new group</Modal.Header>
                <Modal.Content style={{position:'relative',overflowX: 'hidden'}}>
                    <img src={groupBannerPreview} onClick={() => bannerInputRef.current.click()} className="create-group-modal-banner" />
                    <img src={groupAvatarPreview} onClick={() => avatarInputRef.current.click()} className="create-group-modal-avatar" />
                    <input ref={bannerInputRef} accept="image/*" type="file" hidden onChange={bannerChange} className="bannerUpload" />
                    <input ref={avatarInputRef} accept="image/*" type="file" hidden onChange={avatarChange} className="avatarUpload" />
                    <Input fluid onChange={(e) => {setGroupTitleInput(e.target.value)}} value={groupTitleInput} type="text" placeholder="Title" /><br />
                    <Input fluid onChange={(e) => {setGroupDescriptionInput(e.target.value)}} value={groupDescriptionInput} type="text" placeholder="Description" />
                    <small className="create-group-modal-hint">Hint: use #hashtags to make your group better findable!</small><br /><br />
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
                    <Button color="black" onClick={() => {setCreateGroupModalOpen(false)}}>
                        Cancel
                    </Button>
                    {isCreatingGroup ? (
                        <Button content="Create group" labelPosition="right" icon="checkmark" positive loading />
                    ) : (
                        <Button content="Create group" onClick={handleSubmit} labelPosition="right" icon="checkmark" positive />
                    )}
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default Groups;