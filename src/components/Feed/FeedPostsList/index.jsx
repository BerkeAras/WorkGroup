import React, { useEffect, useState } from 'react'
import './style.scss'
import { Feed, Modal, Loader, Button, Pagination } from 'semantic-ui-react'
import { Zap } from 'react-feather'
import PropTypes from 'prop-types'
import loadPosts from '../../../utils/loadPosts'
import W_Modal from '../../W_Modal'

import ReportPost from '../FeedReportPost'
import PostItem from '../FeedPostItem'

export default function PostsList(props) {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [paginationPage, setPaginationPage] = useState(1)
    const [totalPaginationPages, setTotalPagionationPages] = useState(1)
    const [emptyStates, setEmptyStates] = useState(["It's empty here. Start sharing something about your thoughts!", 'Your friends are shy. Get started and write your first post.'])
    const [imageModalVisible, setImageModalVisible] = useState(false)
    const [imageModalUrl, setImageModalUrl] = useState('')
    const [reportModalVisible, setReportModalVisible] = useState(false)
    const [reportModalPostId, setReportModalPostId] = useState(0)
    const [reportSuccessVisible, setReportSuccessVisible] = useState(false)
    const [reportErrorVisible, setReportErrorVisible] = useState(false)
    const [postIdInvalid, setPostIdInvalid] = useState(false)
    const [pinnedModalStatus, setPinnedModalStatus] = useState(0)
    const [pinnedModalVisible, setPinnedModalVisible] = useState(false)
    const [disabledModalVisible, setDisabledModalVisible] = useState(false)
    const [disabledModalStatus, setDisabledModalStatus] = useState(0)
    const [clearedModalVisible, setClearedModalVisible] = useState(false)
    const [clearedModalStatus, setClearedModalStatus] = useState('comments')

    useEffect(() => {
        loadMore()
    }, [props])

    const loadMore = (page = 1) => {
        setIsLoading(true)
        document.querySelector('.app').scrollTo(0, 0)

        let postLoader

        if (props.postId !== undefined) {
            postLoader = loadPosts({ page: 1, filterBy: 'id', filter: props.postId })
        } else {
            if (props.hashTag !== undefined) {
                postLoader = loadPosts({ page: 1, filterBy: 'hashtag', filter: props.hashTag })
            } else {
                if (props.group !== undefined) {
                    postLoader = loadPosts({ page: page, filterBy: 'group', filter: props.group })
                } else {
                    if (props.user !== '*') {
                        postLoader = loadPosts({ page: page, filterBy: 'user', filter: props.user })
                    } else {
                        postLoader = loadPosts({ page: page })
                    }
                }
            }
        }

        setPaginationPage(page)

        postLoader
            .then((res) => {
                setIsLoading(false)
                setItems(Object.values(res.posts))
                setTotalPagionationPages(res.totalPages)

                if (props.postId != undefined) {
                    if (res.totalPages == 0) {
                        setPostIdInvalid(true)
                    } else {
                        setPostIdInvalid(false)
                    }
                } else {
                    setPostIdInvalid(false)
                }
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
                setItems([])
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

    const reloadFeed = () => {
        loadMore(paginationPage)
    }

    return (
        <div>
            {isLoading === false && (
                <Feed>
                    {items.length > 0 ? (
                        <React.Fragment>
                            {items.map((item) => (
                                <PostItem
                                    key={item.id}
                                    post={item}
                                    setImageModalUrl={setImageModalUrl}
                                    setImageModalVisible={setImageModalVisible}
                                    reportModalVisible={setReportModalVisible}
                                    reportModalPostId={setReportModalPostId}
                                    setIsLoading={setIsLoading}
                                    reloadFeed={reloadFeed}
                                    setPinnedModalVisible={setPinnedModalVisible}
                                    setPinnedModalStatus={setPinnedModalStatus}
                                    setDisabledModalVisible={setDisabledModalVisible}
                                    setDisabledModalStatus={setDisabledModalStatus}
                                    setClearedModalVisible={setClearedModalVisible}
                                    setClearedModalStatus={setClearedModalStatus}
                                />
                            ))}

                            {props.postId == undefined && (
                                <div style={{ textAlign: 'center', width: '100%' }}>
                                    <Pagination style={{ marginTop: '20px' }} activePage={paginationPage} onPageChange={(event) => handlePaginationChange(event)} totalPages={totalPaginationPages} />
                                </div>
                            )}
                        </React.Fragment>
                    ) : (
                        <Feed.Event>
                            <Feed.Content>
                                <div className="empty-feed">
                                    <Zap size={35} strokeWidth={2} />
                                    <br />
                                    {postIdInvalid ? (
                                        <span>This Post could not be found. You may have no access to it or it may have been deleted.</span>
                                    ) : (
                                        <span>{emptyStates[Math.floor(Math.random() * emptyStates.length)]}</span>
                                    )}
                                </div>
                            </Feed.Content>
                        </Feed.Event>
                    )}
                </Feed>
            )}

            {isLoading && <Loader active>Loading Feed</Loader>}

            {imageModalVisible && (
                <Modal
                    onClose={() => setImageModalVisible(false)}
                    onClick={() => setImageModalVisible(false)}
                    onOpen={() => setImageModalVisible(true)}
                    open={imageModalVisible}
                    className="image-modal-content"
                >
                    <Modal.Content>
                        <img src={imageModalUrl} />
                    </Modal.Content>
                </Modal>
            )}

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

            {pinnedModalVisible && (
                <W_Modal onClose={() => setPinnedModalVisible(false)} onOpen={() => setPinnedModalVisible(true)} open={pinnedModalVisible} size="mini">
                    <Modal.Header>Post {pinnedModalStatus == 1 ? 'pinned!' : 'unpinned!'}</Modal.Header>
                    <Modal.Content>The Post has been {pinnedModalStatus == 1 ? 'pinned' : 'unpinned'} successfully!</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setPinnedModalVisible(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
            {disabledModalVisible && (
                <W_Modal onClose={() => setDisabledModalVisible(false)} onOpen={() => setDisabledModalVisible(true)} open={disabledModalVisible} size="mini">
                    <Modal.Header>Post {disabledModalStatus == 1 ? 'enabled!' : 'disabled!'}</Modal.Header>
                    <Modal.Content>The Post has been {disabledModalStatus == 1 ? 'enabled' : 'disabled'} successfully!</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setDisabledModalVisible(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
            {clearedModalVisible && (
                <W_Modal onClose={() => setClearedModalVisible(false)} onOpen={() => setClearedModalVisible(true)} open={clearedModalVisible} size="mini">
                    <Modal.Header>{clearedModalStatus == 'comments' ? 'Comments' : 'Likes'} cleared!</Modal.Header>
                    <Modal.Content>All {clearedModalStatus} has been cleared successfully!</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setClearedModalVisible(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}

            {reportSuccessVisible && (
                <W_Modal onClose={() => setReportSuccessVisible(false)} onOpen={() => setReportSuccessVisible(true)} open={reportSuccessVisible} size="mini">
                    <Modal.Header>Post reported!</Modal.Header>
                    <Modal.Content>Thank you for your feedback about this post. We will review it immediately.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setReportSuccessVisible(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
            {reportErrorVisible && (
                <W_Modal onClose={() => setReportErrorVisible(false)} onOpen={() => setReportErrorVisible(true)} open={reportErrorVisible} size="mini">
                    <Modal.Header>Post could not be reported!</Modal.Header>
                    <Modal.Content>Unfortunately, this post could not be reported. Please try again later.</Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setReportErrorVisible(false)}>
                            Dismiss
                        </Button>
                    </Modal.Actions>
                </W_Modal>
            )}
        </div>
    )
}

PostsList.propTypes = {
    user: PropTypes.string,
    group: PropTypes.any,
    postId: PropTypes.number,
    hashTag: PropTypes.string,
}
