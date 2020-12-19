/* eslint-disable no-useless-constructor */
import React, {useState} from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
import './style.scss'
import logo from '../../../static/logo.svg';
import { Button, Input, Message } from 'semantic-ui-react';
import firebase from 'firebase';

class LogOut extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {

		firebase.auth().signOut().then(function() {
			window.location.href = '/';
		}).catch(function(error) {
			window.location.href = '/';
		});

	}
	
	render() {
		return (
			<div className="loginContainer">
				<span>Logging out...</span>
			</div>
		);
	}
};
export default LogOut;