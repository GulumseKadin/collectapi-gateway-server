import React from 'react';
import App, { Container } from 'next/app';
import 'semantic-ui-css/semantic.min.css';
import '../components/Highlight.css';
import 'highlight.js/styles/qtcreator_light.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Layout from '../components/Layout';
import 'isomorphic-unfetch';
import Router from 'next/router';
import NProgress from 'nprogress';
import { NextAuth } from 'next-auth/client';
import { appWithTranslation } from '../i18n';
import { ResponsiveProvider, Responsive } from '../lib/ssr';

Router.events.on('routeChangeStart', url => {
	NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
	static async getInitialProps({ ctx, Component }) {
		let responsive,
			pageProps = {};
		let session = await NextAuth.init(ctx);
		if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
		if (ctx.req) responsive = new Responsive(ctx.req);
		return { pageProps, session, responsive };
	}

	render() {
		const { Component, pageProps, session, responsive } = this.props;
		return (
			<Container>
				<ResponsiveProvider value={responsive}>
					<Layout session={session} {...pageProps}>
						<Component {...pageProps} session={session} />
					</Layout>
				</ResponsiveProvider>
			</Container>
		);
	}
}

export default appWithTranslation(MyApp);
