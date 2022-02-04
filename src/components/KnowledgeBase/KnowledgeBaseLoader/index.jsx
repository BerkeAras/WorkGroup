import React from 'react'
import './style.scss'
import { Loader } from 'semantic-ui-react'

import KnowledgeBaseLoaderImage from '../../static/knowledgebase_loader.webm'

function KnowledgeBaseLoader() {
    return (
        <div className="KnowledgeBaseLoader">
            <div>
                <video controls={false} width="300" height="300" autoPlay muted>
                    <source src={KnowledgeBaseLoaderImage} type="video/webm" />
                </video>
                <br />
                <Loader active size="large" content="" />
            </div>
        </div>
    )
}

export default KnowledgeBaseLoader
