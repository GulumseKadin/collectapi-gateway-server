import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Router, { withRouter } from 'next/router';
import { Link } from '../i18n';

function isActive(current, path) {
	return current === path;
}

function MenuItem({ href, current, icon, title }) {
	return <Link href={href} passHref>
		<Menu.Item as='a' name="inbox" active={isActive(current, href)}>
			<Icon icon={icon} />
			{title}
		</Menu.Item>
	</Link>;
}

class AdminMenu extends Component {
	render() {
		return (
			<Menu fluid vertical>
				<MenuItem current={this.props.router.pathname} href="/admin" title="Dashboard" />
				<MenuItem current={this.props.router.pathname} href="/admin/users" title="Users" />
				<MenuItem current={this.props.router.pathname} href="/admin/scopes" title="Scopes" />
			</Menu>
		);
	}
}
export default withRouter(AdminMenu);
