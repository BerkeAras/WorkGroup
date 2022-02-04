import React, { useEffect, useState } from 'react'
import './style.scss'
import { Feed } from 'semantic-ui-react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import { ThumbsUp, MessageCircle, FileText, Flag, CornerDownRight, Share2 } from 'react-feather'
import PropTypes from 'prop-types'
import getFriendlyDate from '../../../utils/getFriendlyDate'
import likePost from '../../../utils/likePost'
import toggleComment from '../../../utils/toggleComment'
import { LinkPreview } from '@dhaiwat10/react-link-preview';
let linkify = require('linkifyjs')
require('linkifyjs/plugins/hashtag')(linkify)
let linkifyHtml = require('linkifyjs/html')

import unknownAvatar from '../../../static/unknown.png'

import CommentSection from '../FeedCommentSection'

export default function PostItem(props) {
    const [visibleCommentSections, setVisibleCommentSections] = useState([])
    const [imageModalVisible, setImageModalVisible] = useState(false)
    const [imageModalUrl, setImageModalUrl] = useState('')
    const [postUrls, setPostUrls] = useState([]);

    useEffect(() => {
        let links = linkify.find(props.post.post_content.replace(/<[^>]+>/g, ''));

        let urls = [];

        links.forEach(link => {
            if(link.type == "url") {
                urls.push(link.href)
            }
        });

        let uniqueUrls = [...new Set(urls)];

        console.log(uniqueUrls);
        setPostUrls(uniqueUrls);
    }, [])

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

    const linkFetcher = async (url) => {
        const response = await fetch(`https://rlp-proxy.herokuapp.com/v2?url=${url}&test=true`);
        const json = await response.json();
        console.log(json);
        return json.metadata;
    };

    return (
        <React.Fragment>
            <Feed.Event id={'post_' + props.post.id} className={visibleCommentSections.includes(props.post.id) == 0 ? 'event--no-comments-visible' : ''}>
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
                        <Feed.Date>{getFriendlyDate(new Date(props.post.created_at.replace(/-/g, '/')))}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra className={props.post.post_content.length > 465 ? 'collapsed' : ''} text>
                        <div dangerouslySetInnerHTML={{ __html: props.post.post_content }}></div>
                        {postUrls.map((postUrl, index) =>
                            <LinkPreview key={index} width='100%' margin='10px 0' borderColor='rgba(34,36,38,.1)' imageHeight='100px' fetcher={linkFetcher} url={postUrl} />
                        )}
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
                                                    setImageModalUrl(process.env.REACT_APP_API_URL + '/static/' + postImage.post_image_url)
                                                    setImageModalVisible(true)
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
                                commentOpener(e)
                            }}
                            id={'post_comment_id_' + props.post.id}
                        >
                            <MessageCircle size={16} strokeWidth={2.5} />
                            <span>{getComments(props.post.comments)}</span>
                        </a>
                        <Link to={`/app/post/${props.post.id}`} className="share-button">
                            <span>Share</span>
                            <Share2 size={16} strokeWidth={2.5} />
                        </Link>
                        <a
                            href="#"
                            className="report-button"
                            onClick={(e) => {
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
        </React.Fragment>
    )
}

PostItem.propTypes = {
    post: PropTypes.any,
    reportModalVisible: PropTypes.func,
    reportModalPostId: PropTypes.func,
}
