import React from 'react'
const ConfigContext = React.createContext({
    config: {
        appName: 'WorkGroup',
        appLogo: 'default_logo.svg',
        appLocale: 'en',
        appUrl: 'http://localhost:3000',
        appRegistrationEnabled: false,
        appPasswordResetEnabled: false,
        appGroupCreationEnabled: false,
        appMinimumSearchLength: 3,
        appMaximumPostsPerPage: 10,
        serverApiUrl: process.env.REACT_APP_API_URL,
        analyticsGoogleAnalyticsEnabled: false,
        analyticsGoogleAnalyticsKey: '',
        analyticsSentryEnabled: false,
        analyticsSentryDsn: '',
    },
})
export default ConfigContext
