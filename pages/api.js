import React from 'react';
import _ from 'lodash';
import NoSSR from 'react-no-ssr';
import { Divider, Container, Grid, Segment, Header, Image, Table, Loader, Message } from 'semantic-ui-react';
import { i18n, withNamespaces, Link } from '../i18n';
import { GET_APIS_URL, GET_END_POINTS_URL, STRINGS, PRICE_PER_CALL } from '../constants/constants';
import { ssrFetch } from '../lib/rest';
import dynamic from 'next/dynamic';

const Accordion = dynamic(() => import('../components/api_accordion'), {
	loading: () => <Loader active inline="centered" content="Loading..." />,
});

const Description = ({ api, t, scopes }) => {
	if (!api) return;
	return (
		<React.Fragment>
			<p>{api.description}</p>
			<Segment color="blue" compact>
				<span>
					{t('pricing_per_call')}: {api.pricing || PRICE_PER_CALL}$
				</span>
			</Segment>
			{/*<pre>{JSON.stringify(api.scopes, null, 2)}</pre>
			<pre>{JSON.stringify(scopes, null, 2)}</pre>*/}
			{scopes ? (
				_.intersection(scopes, api.scopes).length || _.includes(scopes, 'business') ? (
					<Message positive>
						<Message.Header>{t('scopes_succes')}</Message.Header>
					</Message>
				) : (
					<Message negative>
						<Message.Header>
							{t('scope_error')}{' '}
							<a href="/pricing" target="_top">
								{t('goto_pricing')}
							</a>
						</Message.Header>
					</Message>
				)
			) : (
				<Message >
						<Message.Header>
							{t('scopes_user_null')}{' '}
							<a href="/pricing" target="_top">
								{t('goto_pricing')}
							</a>
						</Message.Header>
					</Message>
			)}
		</React.Fragment>
	);
};
const PricingTable = item => {
	let { head, body } = item && item.price_table;
	if (head && body) {
		return (
			<Table celled columns={head.length}>
				<Table.Header>
					<Table.Row>
						{_.map(head, (text, i) => (
							<Table.HeaderCell key={i}>{text}</Table.HeaderCell>
						))}
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{_.map(body, (row, i) => (
						<Table.Row key={i}>
							{_.map(row, (cell, j) => (
								<Table.Cell key={j}>{cell}</Table.Cell>
							))}
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		);
	}
};

class Detail extends React.Component {
	static async getInitialProps({ req, query }) {
		let { group } = query;
		const [data, api] = await Promise.all([ssrFetch(req, GET_END_POINTS_URL + group).then(res => res.json()), ssrFetch(req, GET_APIS_URL + group).then(res => res.json())]);
		return { endpoints: data.result, api: api.result[0], namespacesRequired: [], mainContainer: { fluid: true } };
	}
	render() {
		const { api, endpoints, t, session } = this.props;
		const scopes = (session && session.user && session.user.scopes) || '';
		return (
			<div style={{ width: '100%' }}>
				<div style={{ background: 'white', padding: '20px 0', borderBottom: '2px solid #b5cc18' }}>
					<Container textAlign="center">
						<Image src={api && api.image_url} rounded inline style={{ width: 80, height: 80, padding: 8 }} />
						<Header as="h2" style={{ marginTop: 0 }}>
							{api && api.name}
						</Header>

						<Divider horizontal>
							<h4>{t('description')}</h4>
						</Divider>
						<Description api={api} t={t} scopes={scopes} />
					</Container>
				</div>
				<Container style={{ padding: '2rem 0' }}>
					{/* <Divider horizontal>
									<h4>Pricing</h4>
								</Divider>
								{Pricing(api)} */}

					<Divider horizontal>
						<h4>{t('end_points')}</h4>
					</Divider>

					<Accordion items={endpoints} activeIndex={api && api.activeIndex} />

					{api.tags &&
						_.map(api.tags, (t, i) => {
							let urlName = _.kebabCase(t);
							return (
								<Link as={`/tags/${urlName}`} href={`/tags/${urlName}`}>
									<a className="button-main">{t}</a>
								</Link>
							);
						})}
				</Container>
			</div>
		);
	}
}

export default withNamespaces()(Detail);
