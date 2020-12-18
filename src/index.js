import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import firebase from 'firebase'
import 'semantic-ui-css/semantic.min.css'

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: 'AIzaSyAfYofAddgGrGNmrGzjR_3pzwx9L0PMf0Q',
    authDomain: 'workgroup-project-development.firebaseapp.com',
    projectId: 'workgroup-project-development',
    storageBucket: 'workgroup-project-development.appspot.com',
    messagingSenderId: '185927153791',
    appId: '1:185927153791:web:8df437e0453cf2c66d274a',
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

ReactDOM.render(<App />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
