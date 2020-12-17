/* eslint-disable no-useless-constructor */
import React, {useState} from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect
} from "react-router-dom";
import './style.scss';
import logo from '../../static/logo.svg';
import { Button, Input } from 'semantic-ui-react';
import firebase from 'firebase';

// Components
import Sidebar from '../../components/Sidebar/';

class MainApp extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="app">
				<Sidebar></Sidebar>
			</div>
		);
	}
};
export default MainApp;