import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './style.scss'
import { Folder, Home } from 'react-feather'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

function KnowledgeBaseSidebar(props) {
    const [folders, setFolders] = useState([])

    useEffect(() => {
        let tokenHeaders = new Headers()
        tokenHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

        let requestOptions = {
            method: 'GET',
            headers: tokenHeaders,
            redirect: 'follow',
        }

        fetch(process.env.REACT_APP_API_URL + '/api/knowledgebase/getFolders', requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setFolders(result)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <div className="KnowledgeBaseSidebar">
            {props.isLoading ? (
                <div className="loader">
                    <Loader active size="medium" content=" " />
                </div>
            ) : (
                <>
                    <NavLink
                        end
                        key="KnowledgeBaseSidebar-home"
                        className={({ isActive }) => (!isActive ? 'KnowledgeBaseSidebar-item' : 'KnowledgeBaseSidebar-item KnowledgeBaseSidebar-item--active')}
                        to="/app/knowledgebase"
                    >
                        <Home size={18} strokeWidth={2.7} /> Home
                    </NavLink>
                    <br />
                    <hr />
                    <br />
                    {folders.map((folder, index) => {
                        return (
                            <NavLink
                                key={index}
                                title={folder.knowledge_base_folder_description}
                                className={({ isActive }) => (!isActive ? 'KnowledgeBaseSidebar-item' : 'KnowledgeBaseSidebar-item KnowledgeBaseSidebar-item--active')}
                                to={'/app/knowledgebase/' + folder.id}
                            >
                                <Folder size={18} strokeWidth={2.7} /> {folder.knowledge_base_folder_name}
                            </NavLink>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default KnowledgeBaseSidebar

KnowledgeBaseSidebar.propTypes = {
    isLoading: PropTypes.bool,
}
