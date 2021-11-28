import React from 'react'
const ConfigContext = React.createContext({
    config: {
        appName: 'WorkGroup',
        appLogo: 'default_logo.svg',
        appLocale: 'en',
        appUrl: 'http://localhost:3000',
        appRegistrationEnabled: false,
        appPasswordResetEnabled: false,
        serverApiUrl: process.env.REACT_APP_API_URL,
        analyticsGoogleAnalyticsEnabled: false,
        analyticsGoogleAnalyticsKey: '',
        analyticsSentryEnabled: false,
        analyticsSentryDsn: '',
    },
})
export default ConfigContext
