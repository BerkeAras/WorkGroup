import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'semantic-ui-css/semantic.min.css'

if (process.env.REACT_APP_USE_SENTRY) {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    })
}

ReactDOM.render(<App />, document.getElementById('root'))
