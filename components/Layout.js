import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from 'react-cookie-consent';
export default class Layout extends React.Component {
	render() {
		return (
			<>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta charSet="utf-8" />
					<title>CollectApi</title>
					<link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
					<link rel="manifest" href="/static/site.webmanifest" />
					<link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
					<link rel="manifest" href="/static/manifest.json" />
					<link rel="shortcut icon" href="/static/favicon.ico" />
				</Head>
				<Header {...this.props} />
				<Container className="root-container" {...this.props.mainContainer}>
					{this.props.children}
				</Container>
				<Footer />
				<CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
			</>
		);
	}
}
