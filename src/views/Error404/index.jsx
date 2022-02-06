import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import { Button } from 'semantic-ui-react'
import { AlertTriangle } from 'react-feather'
import AuthContext from '../../store/AuthContext'

// Components
import Header from '../../components/Header/Header'

function Error404() {
    const contextValue = useContext(AuthContext)

    useEffect(() => {
        document.title = 'Page not found – WorkGroup'
    }, [contextValue])

    return (
        <div className="app">
            {Object.keys(contextValue).length > 0 && <Header />}
            <div id="main_content" className="main_content main_content--group-request">
                <center>
                    <AlertTriangle size={35} strokeWidth={2} />
                    <h1>An Error occured!</h1>
                    <span>The page you are looking for could not be found! It may have been removed or you have no access to it.</span>
                    <br />
                    <br />
                    {Object.keys(contextValue).length > 0 ? (
                        <Button as={Link} to="/app" primary component={Button}>
                            Your Feed
                        </Button>
                    ) : (
                        <Button as={Link} to="/" primary component={Button}>
                            Sign In
                        </Button>
                    )}
                </center>
            </div>
        </div>
    )
}

export default Error404
