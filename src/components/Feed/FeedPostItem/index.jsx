import React, { useEffect, useState } from 'react'
import './style.scss'
import { Feed, Dropdown, Modal, Button } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { ThumbsUp, MessageCircle, FileText, Flag, CornerDownRight, Share2, Tool } from 'react-feather'
import PropTypes from 'prop-types'
import W_Modal from '../../W_Modal'
import likePost from '../../../utils/likePost'
import toggleComment from '../../../utils/toggleComment'
import getFriendlyDate from '../../../utils/getFriendlyDate'
import { format } from 'date-fns'

import unknownAvatar from '../../../static/unknown.png'

import CommentSection from '../FeedCommentSection'

export default function PostItem(props) {
    const [visibleCommentSections, setVisibleCommentSections] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteCommentsModal, setShowDeleteCommentsModal] = useState(false)
    const [showDeleteLikesModal, setShowDeleteLikesModal] = useState(false)

    const toggleLongText = (postId) => {
        document.querySelector('#post_' + postId + ' div.text').classList.toggle('collapsed')
        if (document.querySelector('#post_' + postId + ' .toggle-long-text-button')) {
            if (document.querySelector('#post_' + postId + ' .toggle-long-text-button').innerText == 'show more') {
                document.querySelector('#post_' + postId + ' .toggle-long-text-button').innerText = 'show less'
            } else {
                document.querySelector('#post_' + postId + ' .toggle-long-text-button').innerText = 'show more'
            }
        }
    }

    const getLikes = (likes) => {
        let returnStr = '0 Likes'

        if (likes == 1) {
            returnStr = '1 Like'
        } else {
            returnStr = likes + ' Likes'
        }

        return returnStr
    }

    const getComments = (comments) => {
        let returnStr = '0 Comments'

        if (comments == 1) {
            returnStr = '1 Comment'
        } else {
            returnStr = comments + ' Comments'
        }

        return returnStr
    }

    const reportPost = (e, postId) => {
        e.preventDefault()

        props.reportModalVisible(true)
        props.reportModalPostId(postId)
    }

    const commentOpener = (e) => {
        setVisibleCommentSections(toggleComment(e, visibleCommentSections))
    }

    const pinPost = (postId) => {
        props.setIsLoading(true)

        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                postId: postId,
            }),
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/content/pinPost', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.setIsLoading(false)
                props.reloadFeed()
                props.setPinnedModalVisible(true)
                props.setPinnedModalStatus(data.is_pinned)
            })
    }

    const disablePost = (postId) => {
        props.setIsLoading(true)

        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                postId: postId,
            }),
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/content/togglePostStatus', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.setIsLoading(false)
                props.reloadFeed()
                props.setDisabledModalVisible(true)
                props.setDisabledModalStatus(data.status)
            })
    }

    const clearComments = (postId) => {
        props.setIsLoading(true)

        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                postId: postId,
            }),
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/content/clearComments', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.setIsLoading(false)
                props.reloadFeed()
                props.setClearedModalVisible(true)
                props.setClearedModalStatus('comments')
            })
    }

    const clearLikes = (postId) => {
        props.setIsLoading(true)

        let header = new Headers()
        header.append('Authorization', 'Bearer ' + localStorage.getItem('token'))
        header.append('Content-Type', 'application/json')

        const requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify({
                postId: postId,
            }),
        }
        // eslint-disable-next-line no-undef
        fetch(process.env.REACT_APP_API_URL + '/api/content/clearLikes', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                props.setIsLoading(false)
                props.reloadFeed()
                props.setClearedModalVisible(true)
                props.setClearedModalStatus('likes')
            })
    }

    return (
        <React.Fragment key={props.post.id}>
            <Feed.Event
                id={'post_' + props.post.id}
                className={[
                    visibleCommentSections.includes(props.post.id) == 0 ? 'event--no-comments-visible' : '',
                    props.post.is_pinned == 1 ? 'event--pinned' : '',
                    props.post.status == 0 ? 'event--disabled' : '',
                ]}
            >
                <Feed.Label className="user-avatar">
                    <Link to={'/app/user/' + props.post.email}>
                        {props.post.avatar == '' ? <img loading="lazy" src={unknownAvatar} /> : <img loading="lazy" src={process.env.REACT_APP_API_URL + '/' + props.post.avatar.replace('./', '')} />}
                    </Link>
                </Feed.Label>
                <Feed.Content>
                    <Feed.Summary>
                        {props.post.group_id !== 0 && (
                            <>
                                <Link className="group" to={'/app/group/' + props.post.group_id}>
                                    {props.post.group.group_title}
                                </Link>
                                <br />
                            </>
                        )}
                        <Link className={`${props.post.group_id !== 0 && `user--group-member `}user`} to={'/app/user/' + props.post.email}>
                            {props.post.group_id !== 0 && <CornerDownRight size={12} strokeWidth={2.5} />} {props.post.name}
                        </Link>
                        <Feed.Date title={format(new Date(props.post.created_at.replace(/-/g, '/')), 'dd.MM.yyyy - HH:mm:ss')}>
                            {getFriendlyDate(new Date(props.post.created_at.replace(/-/g, '/')))}
                        </Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra className={props.post.post_content.length > 465 ? 'collapsed' : ''} text>
                        <div dangerouslySetInnerHTML={{ __html: props.post.post_content }}></div>
                        {props.post.post_content.length > 465 && (
                            <a
                                href="#"
                                className="toggle-long-text-button"
                                onClick={() => {
                                    toggleLongText(props.post.id)
                                }}
                            >
                                <span>show more</span>
                            </a>
                        )}
                        {props.post.images.length > 0 && (
                            <div className="post-images">
                                {props.post.images.map((postImage, index) => {
                                    return (
                                        <div key={index} className={`post-image ${props.post.images.length == 1 && 'post-image--single'}`}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    props.setImageModalUrl(process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url)
                                                    props.setImageModalVisible(true)
                                                }}
                                            >
                                                <img loading="lazy" src={process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url} />
                                            </a>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        {props.post.files.length > 0 && (
                            <div className="post-files">
                                {props.post.files.map((postFile, index) => {
                                    return (
                                        <a href={process.env.REACT_APP_API_URL + '/static/files/' + postFile.post_file_url} target="_blank" rel="noreferrer" download key={index} className="post-file">
                                            <div className="post-file-icon">
                                                <FileText size={20} strokeWidth={2} />
                                            </div>
                                            <span className="post-file-text">{postFile.post_file_original}</span>
                                        </a>
                                    )
                                })}
                            </div>
                        )}
                    </Feed.Extra>
                    <Feed.Meta>
                        <Feed.Like
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                likePost(e)
                            }}
                            id={'post_like_id_' + props.post.id}
                            className={props.post.hasLiked}
                        >
                            <ThumbsUp size={16} strokeWidth={2.5} />
                            <span>{getLikes(props.post.likes)}</span>
                        </Feed.Like>
                        <a
                            href="#"
                            className="comment-button"
                            onClick={(e) => {
                                e.preventDefault()
                                commentOpener(e)
                            }}
                            id={'post_comment_id_' + props.post.id}
                        >
                            <MessageCircle size={16} strokeWidth={2.5} />
                            <span>{getComments(props.post.comments)}</span>
                        </a>
                        {localStorage.getItem('user_admin') !== undefined && localStorage.getItem('user_admin') == '1' && (
                            <Dropdown
                                trigger={
                                    <a
                                        href="#"
                                        className="administrate-button"
                                        onClick={(e) => {
                                            e.preventDefault()
                                        }}
                                    >
                                        <span>Administrate</span>
                                        <Tool size={16} strokeWidth={2.5} />
                                    </a>
                                }
                                direction="left"
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => {
                                            pinPost(props.post.id)
                                        }}
                                        text={`${props.post.is_pinned == 1 ? 'Unpin' : 'Pin'} this Post`}
                                    />
                                    <Dropdown.Item
                                        onClick={() => {
                                            disablePost(props.post.id)
                                        }}
                                        text={`${props.post.status == 1 ? 'Disable' : 'Enable'} this Post`}
                                    />
                                    <Dropdown.Item
                                        onClick={() => {
                                            setShowDeleteCommentsModal(true)
                                        }}
                                        text="Clear all Comments"
                                        description="Caution!"
                                    />
                                    <Dropdown.Item
                                        onClick={() => {
                                            setShowDeleteLikesModal(true)
                                        }}
                                        text="Clear all Likes"
                                        description="Caution!"
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                        <Link to={`/app/post/${props.post.id}`} className="share-button">
                            <span>Share</span>
                            <Share2 size={16} strokeWidth={2.5} />
                        </Link>
                        <a
                            href="#"
                            className="report-button"
                            onClick={(e) => {
                                e.preventDefault()
                                reportPost(e, props.post.id)
                            }}
                        >
                            <span>Report</span>
                            <Flag size={16} strokeWidth={2.5} />
                        </a>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
            {visibleCommentSections.includes(props.post.id) > 0 && <CommentSection postId={props.post.id.toString()} />}

            {showDeleteCommentsModal && (
                <W_Modal onClose={() => setShowDeleteCommentsModal(false)} onOpen={() => setShowDeleteCommentsModal(true)} open={showDeleteCommentsModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>Do you really want to delete all comments of this post? You cannot undo this operation!</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowDeleteCommentsModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            color="red"
                            onClick={() => {
                                clearComments(props.post.id)
                            }}
                        >
                            Delete irreversibly
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}

            {showDeleteLikesModal && (
                <W_Modal onClose={() => setShowDeleteLikesModal(false)} onOpen={() => setShowDeleteLikesModal(true)} open={showDeleteLikesModal} size="mini">
                    <Modal.Header>Warning</Modal.Header>
                    <Modal.Content>
                        <p>Do you really want to delete all likes of this post? You cannot undo this operation!</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button disabled={isLoading} color="black" onClick={() => setShowDeleteLikesModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            color="red"
                            onClick={() => {
                                clearLikes(props.post.id)
                            }}
                        >
                            Delete irreversibly
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
        </React.Fragment>
    )
}

PostItem.propTypes = {
    post: PropTypes.any,
    reportModalVisible: PropTypes.func,
    reportModalPostId: PropTypes.func,
    setImageModalUrl: PropTypes.func,
    setImageModalVisible: PropTypes.func,
    setIsLoading: PropTypes.func,
    reloadFeed: PropTypes.func,
    setPinnedModalVisible: PropTypes.func,
    setPinnedModalStatus: PropTypes.func,
    setDisabledModalVisible: PropTypes.func,
    setDisabledModalStatus: PropTypes.func,
    setClearedModalVisible: PropTypes.func,
    setClearedModalStatus: PropTypes.func,
}
