/* eslint-disable no-useless-constructor */
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import './style.scss';
import { Button, Input } from 'semantic-ui-react';
import firebase from 'firebase';
import logo from '../../static/logo.svg';

// Components
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

class MainApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app">
        <Header />
        <Sidebar />
      </div>
    );
  }
}
export default MainApp;
