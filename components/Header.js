//import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import './main.css';
import React from 'react';
import { Container, Image, Menu, Icon, Dropdown, Flag, Responsive, Sidebar } from 'semantic-ui-react';
import { STRINGS } from '../constants/constants';
import { NextAuth } from 'next-auth/client';
import { i18n, withNamespaces, Link } from '../i18n';
import { isAdmin } from './isAdmin';
import { SsrResponsive } from '../lib/ssr';

function isActive(current, path) {
	return current === path;
}

class CurrentLocale extends React.Component {
	render() {
		const { t } = this.props;
		return (
			<Menu.Item onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')} header>
				<Flag name={i18n.language === 'en' ? 'gb' : 'tr'} />
				{t('language')}
			</Menu.Item>
		);
	}
}
//const CurrentLocale = withNamespaces('common')(_CurrentLocale);

export class SignInMessage extends React.Component {
	render() {
		const { router, t, session } = this.props;
		if (session && session.user) {
			return (
				<Dropdown item simple text={t('account')} direction="left">
					<Dropdown.Menu>
						<Dropdown.Header icon="user circle" content={session.user.email} />
						<Dropdown.Divider />
						{isAdmin(this.props) && (
							<Link href="/admin" passHref>
								<Dropdown.Item as="a" icon="chess king" text={t('admin')} />
							</Link>
						)}
						<Link href="/auth" passHref>
							<Dropdown.Item as="a" active={isActive(router.pathname, '/auth')} icon="edit" text={t('profile')} />
						</Link>
						<Link href="/auth/analytic" passHref>
							<Dropdown.Item as="a" active={isActive(router.pathname, '/auth/analytic')} icon="area chart" text={t('analytics')} />
						</Link>

						<Dropdown.Item
							icon="sign-out"
							text={t('signout')}
							onClick={() =>
								NextAuth.signout()
									.then(() => Router.push('/'))
									.catch(alert)
							}
						/>
					</Dropdown.Menu>
				</Dropdown>
			);
		} else {
			return (
				<Link href="/auth" passHref>
					<Menu.Item as="a" active={isActive(this.props.router.pathname, '/auth')} name="signin">
						<Icon name="sign in" />
						{t('signin')}
					</Menu.Item>
				</Link>
			);
		}
	}
}

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

import { logPageView } from '../lib/analytics';

const MenuLink = ({ href, router, title, icon }) => {
	return (
		<Link href={href} passHref>
			<Menu.Item as="a" active={isActive(router.pathname, href)} header>
				{icon && <Icon name={icon} />}
				{title}
			</Menu.Item>
		</Link>
	);
};
const DropdownMobile = props => {
	let { router, t, session } = props;
	return (
		<Menu.Menu position="right">
			<Dropdown item simple icon="bars" direction="right">
				<Dropdown.Menu>
					{session && session.user ? (
						<>
							<Dropdown.Header icon="user circle" content={session.user.email} />
							<Dropdown.Divider />
							{isAdmin(props) && (
								<Link href="/admin" passHref>
									<Dropdown.Item as="a" icon="chess king" text={t('admin')} />
								</Link>
							)}
							<Link href="/auth" passHref>
								<Dropdown.Item as="a" active={isActive(router.pathname, '/auth')} icon="edit" text={t('profile')} />
							</Link>
							<Link href="/auth/analytic" passHref>
								<Dropdown.Item as="a" active={isActive(router.pathname, '/auth/analytic')} icon="area chart" text={t('analytics')} />
							</Link>
							<Dropdown.Item
								icon="sign-out"
								text={t('signout')}
								onClick={() =>
									NextAuth.signout()
										.then(() => Router.push('/'))
										.catch(alert)
								}
							/>
						</>
					) : (
						<Link href="/auth" passHref>
							<Menu.Item as="a" active={isActive(router.pathname, '/auth')} name="signin">
								<Icon name="sign in" />
								{t('signin')}
							</Menu.Item>
						</Link>
					)}
					<Dropdown.Divider />
					<Link href="/pricing" passHref>
						<Dropdown.Item as="a" icon="dollar" content={t('pricing')} />
					</Link>
					<Link href="/contact" passHref>
						<Dropdown.Item as="a" icon="add" content={t('publish_api')} />
					</Link>

					<Dropdown.Item onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'tr' : 'en')}>
						<Flag name={i18n.language === 'en' ? 'gb' : 'tr'} />
						{t('language')}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</Menu.Menu>
	);
};
class _Menu extends React.Component {
	componentDidMount() {
		logPageView();
	}
	componentDidUpdate() {
		logPageView();
	}

	render() {
		const { router, t } = this.props;
		return (
			<>
				<Menu className="navbar" inverted borderless fixed={'top'} style={fixedMenuStyle}>
					<Container>
						<Menu.Item href="/" style={{ padding: 3 }}>
							<Image size="mini" src="/static/images/knot/knotapi@0,1x.png" style={{ padding: 3 }} />
						</Menu.Item>

						<MenuLink router={router} href="/" title={t('collectapi')} />

						<SsrResponsive as={Menu.Menu} minWidth={SsrResponsive.onlyTablet.minWidth} position="right">
							<MenuLink router={router} href="/contact" icon="add" title={t('publish_api')} />
							<MenuLink router={router} href="/pricing" icon="dollar" title={t('pricing')} />
							<SignInMessage {...this.props} />
							<CurrentLocale {...this.props} />
						</SsrResponsive>
						<SsrResponsive as={DropdownMobile} {...SsrResponsive.onlyMobile} {...this.props} />
					</Container>
				</Menu>
				<div style={{ height: 41 }} />
			</>
		);
	}
}

export default withRouter(withNamespaces('common')(_Menu));
