/* eslint-disable no-useless-constructor */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
import './style.scss'
import { Button, Loader } from 'semantic-ui-react'
import { Zap, AlertTriangle } from 'react-feather'
import unknownAvatar from '../../static/unknown.png'
import unknownBanner from '../../static/banner.jpg'

// Components
import Header from '../../components/Header/Header'

function GroupRequestUpdate() {
    let { id, request_id, request_status } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        document.title = 'A new group request – WorkGroup'

        if (request_status == 'cancelled' || request_status == 'approved' || request_status == 'rejected') {
            setIsLoading(true)
            setHasError(false)

            let tokenHeader = new Headers()
            tokenHeader.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

            let formdata = new FormData()
            formdata.append('request_id', request_id)
            formdata.append('new_status', request_status)

            const requestOptions = {
                method: 'POST',
                headers: tokenHeader,
                body: formdata,
            }

            // eslint-disable-next-line no-undef
            fetch(process.env.REACT_APP_API_URL + '/api/group/updateRequestStatus', requestOptions)
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    if (response.status == 1) {
                        setIsLoading(false)
                        setHasError(false)
                    } else {
                        setIsLoading(false)
                        setHasError(true)
                    }
                })
        } else {
            setIsLoading(false)
            setHasError(true)
        }
    }, [id, request_id, request_status])

    return (
        <div className="app">
            <Header />
            <div id="main_content" className="main_content main_content--group-request">
                <center>
                    {isLoading ? (
                        <>
                            <Zap size={35} strokeWidth={2} />
                            <h1>Updating the request status...</h1>

                            <Loader className="app-loader" active size="large" content="Just a second..." />
                        </>
                    ) : hasError ? (
                        <>
                            <AlertTriangle size={35} strokeWidth={2} />
                            <h1>An error occurred!</h1>
                            <span>You have no permission to update the request!</span>
                            <br />
                            <br />
                            <Link to="/app" primary component={Button}>
                                Your Feed
                            </Link>
                        </>
                    ) : (
                        <>
                            <Zap size={35} strokeWidth={2} />
                            <h1>You have successfully updated the request status.</h1>
                            <span>You {request_status} the group join request successfully!</span>
                            <br />
                            <br />
                            <Link to="/app" primary component={Button}>
                                Your Feed
                            </Link>
                        </>
                    )}
                </center>
            </div>
        </div>
    )
}

export default GroupRequestUpdate
