import React, { useEffect, useState } from 'react'
import './style.scss'
import { Feed, Modal, Loader, Button, Pagination } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { ThumbsUp, MessageCircle, Zap, FileText, Flag, CornerDownRight } from 'react-feather'
import PropTypes from 'prop-types'
import getFriendlyDate from '../../utils/getFriendlyDate'
import loadPosts from '../../utils/loadPosts'
import likePost from '../../utils/likePost'
import toggleComment from '../../utils/toggleComment'
import VirtualScroll from "react-dynamic-virtual-scroll";

import unknownAvatar from '../../static/unknown.png'

import CommentSection from '../_App_CommentSection/'
import ReportPost from '../_App_ReportPost/'

export default function PostsList(props) {

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationPage, setPaginationPage] = useState(1)
    const [totalPaginationPages, setTotalPagionationPages] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [visibleCommentSections, setVisibleCommentSections] = useState([]);
    const [emptyStates, setEmptyStates] = useState(["It's empty here. Start sharing something about your thoughts!", 'Your friends are shy. Get started and write your first post.']);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [imageModalUrl, setImageModalUrl] = useState('');
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportModalPostId, setReportModalPostId] = useState(0);
    const [reportSuccessVisible, setReportSuccessVisible] = useState(false);
    const [reportErrorVisible, setReportErrorVisible] = useState(false);

    useEffect(() => {
        loadMore();
        console.log(props.group, props.user);
    }, [])

    const loadMore = (page = 1) => {
        setIsLoading(true);
        document.querySelector('.app').scrollTo(0, 0)

        let postLoader;

        if (props.group !== undefined) {
            postLoader = loadPosts({page: page, filterBy: 'group', filter: props.group});
        } else {

            if (props.user !== "*") {
                postLoader = loadPosts({page: page, filterBy: 'user', filter: props.user});
            } else {
                postLoader = loadPosts({page: page});
            }

        }

        setPaginationPage(page);

        postLoader.then(res => {
            setIsLoading(false);
            setItems(Object.values(res.posts));
            setTotalPagionationPages(res.totalPages);
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
            setItems([]);
        })
    }

    const handlePaginationChange = (event) => {
        loadMore(Number.parseInt(event.target.getAttribute('value')))
    }

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

        setReportModalVisible(true);
        setReportModalPostId(postId);
    }

    const commentOpener = (e) => {
        setVisibleCommentSections(toggleComment(e, visibleCommentSections));
    }

    return (
        <div>
            {isLoading === false && (
                <Feed>
                    {items.length > 0 ? (
                        <React.Fragment>
                            {items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <Feed.Event id={'post_' + item.id} className={visibleCommentSections.includes(item.id) == 0 ? 'event--no-comments-visible' : ''}>
                                        <Feed.Label className="user-avatar">
                                            <Link to={'/app/user/' + item.email}>
                                                {item.avatar == '' ? <img src={unknownAvatar} /> : <img src={process.env.REACT_APP_API_URL + '/' + item.avatar.replace('./', '')} />}
                                            </Link>
                                        </Feed.Label>
                                        <Feed.Content>
                                            <Feed.Summary>
                                                {item.group_id !== 0 && (
                                                    <>
                                                        <Link className="group" to={'/app/group/' + item.group_id}>
                                                            {item.group.group_title}
                                                        </Link>
                                                        <br />
                                                    </>
                                                )}
                                                <Link className={`${item.group_id !== 0 && `user--group-member `}user`} to={'/app/user/' + item.email}>
                                                    {item.group_id !== 0 && <CornerDownRight size={12} strokeWidth={2.5} />} {item.name}
                                                </Link>
                                                <Feed.Date>{getFriendlyDate(new Date(item.created_at))}</Feed.Date>
                                            </Feed.Summary>
                                            <Feed.Extra className={item.post_content.length > 465 ? 'collapsed' : ''} text>
                                                <div dangerouslySetInnerHTML={{ __html: item.post_content }}></div>
                                                {item.post_content.length > 465 && (
                                                    <a
                                                        href="#"
                                                        className="toggle-long-text-button"
                                                        onClick={() => {
                                                            toggleLongText(item.id)
                                                        }}
                                                    >
                                                        <span>show more</span>
                                                    </a>
                                                )}
                                                {item.images.length > 0 && (
                                                    <div className="post-images">
                                                        {item.images.map((postImage, index) => {
                                                            return (
                                                                <div key={index} className={`post-image ${item.images.length == 1 && 'post-image--single'}`}>
                                                                    <a
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            setImageModalUrl(process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url)
                                                                            setReportModalVisible(true)
                                                                        }}
                                                                    >
                                                                        <img src={process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url} />
                                                                    </a>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                {item.files.length > 0 && (
                                                    <div className="post-files">
                                                        {item.files.map((postFile, index) => {
                                                            return (
                                                                <a
                                                                    href={process.env.REACT_APP_API_URL + '/static/files/' + postFile.post_file_url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    download
                                                                    key={index}
                                                                    className="post-file"
                                                                >
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
                                                <Feed.Like href="#" onClick={(e) => {likePost(e)}} id={'post_like_id_' + item.id} className={item.hasLiked}>
                                                    <ThumbsUp size={16} strokeWidth={2.5} />
                                                    <span>{getLikes(item.likes)}</span>
                                                </Feed.Like>
                                                <a href="#" className="comment-button" onClick={(e) => {commentOpener(e)}} id={'post_comment_id_' + item.id}>
                                                    <MessageCircle size={16} strokeWidth={2.5} />
                                                    <span>{getComments(item.comments)}</span>
                                                </a>
                                                <a
                                                    href="#"
                                                    className="report-button"
                                                    onClick={(e) => {
                                                        reportPost(e, item.id)
                                                    }}
                                                    id={'post_comment_id_' + item.id}
                                                >
                                                    <span>Report</span>
                                                    <Flag size={16} strokeWidth={2.5} />
                                                </a>
                                            </Feed.Meta>
                                        </Feed.Content>
                                    </Feed.Event>
                                    {visibleCommentSections.includes(item.id) > 0 && <CommentSection postId={item.id.toString()} />}
                                </React.Fragment>
                            ))}

                            <div style={{textAlign:'center',width:'100%'}}>
                                <Pagination style={{marginTop:'20px'}} activePage={paginationPage} onPageChange={(event) => handlePaginationChange(event)} defaultActivePage={1} totalPages={totalPaginationPages} />
                            </div>

                        </React.Fragment>
                    ) : (
                        <Feed.Event>
                            <Feed.Content>
                                <div className="empty-feed">
                                    <Zap size={35} strokeWidth={2} />
                                    <br />
                                    <span>{emptyStates[Math.floor(Math.random() * emptyStates.length)]}</span>
                                </div>
                            </Feed.Content>
                        </Feed.Event>
                    )}
                </Feed>
            )}

            {isLoading && <Loader active>Loading Feed</Loader>}

            <Modal
                onClose={() => imageModalVisible(false)}
                onClick={() => imageModalVisible(false)}
                onOpen={() => imageModalVisible(true)}
                open={imageModalVisible}
                className="image-modal-content"
            >
                <Modal.Content>
                    <img src={imageModalUrl} />
                </Modal.Content>
            </Modal>

            {reportModalVisible && (
                <ReportPost
                    handleClose={() => setReportModalVisible(false)}
                    handleOpen={() => setReportModalVisible(true)}
                    handleSuccessMessage={() => setReportSuccessVisible(true)}
                    handleErrorMessage={() => setReportErrorVisible(true)}
                    open={reportModalVisible}
                    postId={reportModalPostId}
                />
            )}

            <Modal
                onClose={() => setReportSuccessVisible(false)}
                onOpen={() => setReportSuccessVisible(true)}
                open={reportSuccessVisible}
                size="mini"
            >
                <Modal.Header>Post reported!</Modal.Header>
                <Modal.Content>Thank you for your feedback about this post. We will review it immediately.</Modal.Content>
                <Modal.Actions>
                    <Button
                        color="black"
                        onClick={() => setReportSuccessVisible(false)}
                    >
                        Dismiss
                    </Button>
                </Modal.Actions>
            </Modal>
            <Modal onClose={() => setReportErrorVisible(false)} onOpen={() => setReportErrorVisible(true)} open={reportErrorVisible} size="mini">
                <Modal.Header>Post could not be reported!</Modal.Header>
                <Modal.Content>Unfortunately, this post could not be reported. Please try again later.</Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setReportErrorVisible(false)}>
                        Dismiss
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    )

}

PostsList.propTypes = {
    user: PropTypes.string,
    group: PropTypes.any,
}