import React, {Component} from 'react';

import AuxComponent from '../AuxComponent/AuxComponent';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
	state = {
		showSideDrawer: false
	}

	sideDrawerClosedHandler = () => {
		this.setState({showSideDrawer: false});
	}

	drawerToggle = () => {
		this.setState((prevState) => {
			return {showSideDrawer: !prevState.showSideDrawer};
		});
	}

	render() {
		return (
			<AuxComponent>
				<Toolbar sideDrawerToggle={this.drawerToggle}/>
				<SideDrawer
					open={this.state.showSideDrawer}
					closed={this.sideDrawerClosedHandler}
				/>
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</AuxComponent>
		);
	}

}

export default Layout;
