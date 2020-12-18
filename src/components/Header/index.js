import React from 'react';
import './style.scss';
import logo from '../../static/logo.svg';

// Icons
import { User } from 'react-feather';

class Header extends React.Component {

	render() {

		return (
			<div className="header">

				<img src={logo} alt="Logo" className="header__logo" />

			</div>
		)

	}

}

export default Header;