import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink, useParams } from 'react-router-dom'
import './style.scss'

function KnowledgeBaseReadFile() {

    const [folders, setFolders] = useState([]);

    useEffect(() => {
        /*
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
        */
    }, [])

    return (
        <div className="KnowledgeBaseFileReader">
            <h1>ReadFile</h1>
        </div>
    );
}

export default KnowledgeBaseReadFile;