import React from 'react';
import { Container, Image, Menu, Visibility, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { STRINGS } from '../constants/constants';

const menuStyle = {
	boxShadow: 'none',
	border: 'none',
	borderRadius: 0,

	backgroundColor: '#1b1c1d',
	transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
	boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
	border: 'none',
	borderRadius: 0,
	backgroundColor: '#1b1c1d',
	transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

class _Menu extends React.Component {
	state = {
		menuFixed: false,
		overlayFixed: false,
	};

	stickOverlay = () => this.setState({ overlayFixed: true });

	stickTopMenu = () => this.setState({ menuFixed: true });

	unStickOverlay = () => this.setState({ overlayFixed: false });

	unStickTopMenu = () => this.setState({ menuFixed: false });
	render() {
		const { menuFixed } = this.state;
		const { t } = this.props;
		return (
			<Visibility onBottomPassed={this.stickTopMenu} onBottomVisible={this.unStickTopMenu} once={false}>
				<style>
					{`
					._nav:hover {
						text-decoration: none
					}
					`}
				</style>
				<Menu inverted borderless fixed={'top'} style={menuFixed ? fixedMenuStyle : menuStyle}>
					<Container>
						<Menu.Item style={{ padding: 3 }}>
							<NavLink to="/">
								<Image size="mini" src="/images/knot/knotapi@0,25x.png" style={{ backgroundColor: '#1b1c1d', borderRadius: 3, padding: 3 }} />
							</NavLink>
						</Menu.Item>
						<NavLink to="/" className="_nav">
							<Menu.Item header >
								Collect Api
							</Menu.Item>
						</NavLink>
						<Menu.Menu position="right">
							<NavLink to="/contact" className="_nav">
								<Menu.Item header >
								<Icon name="add" />
								{t('publish_api')}
								</Menu.Item>
							</NavLink>
						</Menu.Menu>

						{/* <Menu.Item as="a">Kategoriler</Menu.Item> */}

						{
							// search here
						}
					</Container>
				</Menu>
				<div style={{ height: 48 }} />
			</Visibility>
		);
	}
}

export default _Menu;
