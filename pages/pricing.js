import React, { Component } from 'react';
import { Button, Segment, Icon, Grid, GridColumn, Header, Container, Divider, List, Table, Label } from 'semantic-ui-react';
import _ from 'lodash';
import { withNamespaces, Link } from '../i18n';
import { GET_APIS_URL } from '../constants/constants';
import { ssrFetch } from '../lib/rest';

const ContactUs = withNamespaces()(({ t }) => (
	<Link href="/contact" passHref>
		<Button as="a" fluid primary>
			{t('contact_us')}
		</Button>
	</Link>
));

const Cell = ({ title, description, price, starts = true, lines, apis }) => (
	<GridColumn width={4} style={{ margin: '40px 0 ' }}>
		<Segment raised textAlign="left">
			<Header as="h1">{title}</Header>
			<Header as="h5" style={{ margin: 0, minHeight: '36px' }}>
				{description}
			</Header>
			<Divider />
			{price && (
				<div style={{ margin: 0 }}>
					<div style={{ fontSize: 16, color: '#333', visibility: starts ? 'visible' : 'hidden' }}>Starts from</div>
					<span style={{ fontSize: '72px', lineHeight: '72px' }}>
						${price}
						<span style={{ fontSize: 16, color: '#A9A9A9' }}>/mo</span>
					</span>
				</div>
			)}

			<ContactUs />

			<List divided relaxed verticalAlign="middle">
				{_.map(lines, ({ text, description = '', icon = 'right triangle' }, i) => (
					<List.Item key={i}>
						<div style={{ width: 25, marginRight: 5, textAlign: 'center', display: 'inline-block' }}>
							<List.Icon name={icon} size="large" />
						</div>
						<List.Content style={{ display: 'inline-block' }}>
							<List.Header>{text}</List.Header>
							<List.Description>{description}</List.Description>
						</List.Content>
					</List.Item>
				))}
			</List>
		</Segment>
		{/*{apis && apis.length && (
			<Segment color="black" padded>
				<List divided relaxed verticalAlign="middle" size="small">
					<List.Item>
						<Header as="h3" style={{ textAlign: 'left', margin: 0 }}>
							{title} Tier Apis
						</Header>
					</List.Item>
					{_.map(apis, (text, i) => (
						<List.Item key={i}>
							<List.Header>{text}</List.Header>
						</List.Item>
					))}
				</List>
			</Segment>
		)}*/}
	</GridColumn>
);
const ApiListTable = data => (
	<Table.Body>
		{_.map(data, ({ name, basic, premium }) => {
			return (
				<Table.Row key={name}>
					<Table.Cell>{name}</Table.Cell>
					<Table.Cell>{basic && <Icon color="green" name="checkmark" size="large" />}</Table.Cell>
					<Table.Cell>{premium && <Icon color="green" name="checkmark" size="large" />}</Table.Cell>
					<Table.Cell>
						<Icon color="green" name="checkmark" size="large" />
					</Table.Cell>
				</Table.Row>
			);
		})}
	</Table.Body>
);
const PriceList = [
	{
		title: 'Basic',
		description: 'Basic services to get started',
		starts: false,
		price: 20,
		lines: [{ text: 'Access to Basic tier Services', icon: 'lightning' }, { text: 'Mail Support', icon: 'mail' }],
		apis: ['Spor Api', 'Haberler Api', 'Seyahat Api', 'Türkçe Sözlük Api', 'Yemek Tarifi Api'],
	},
	{
		title: 'Premium',
		description: 'Most powerful services to level up with',
		starts: false,
		price: 100,
		lines: [{ text: 'All Basic Perks', icon: 'add' }, { text: 'Access to Premium tier Services', icon: 'lightning' }, { text: 'Mail Support', icon: 'mail' }],
		apis: ['Nöbetci Eczane Api', 'Obje Analiz Api', 'Çıplaklık Algılama Api', 'Çeviri Api', 'Hal Fiyatları Api', 'Altın ve Döviz Fiyatları Api'],
	},
	{
		title: 'Enterprise',
		description: 'Premium service and expert guidance to get results fast',
		price: 200,
		lines: [
			{ text: 'All Premium Perks', icon: 'add' },
			{ text: 'Phone & Mail Support', icon: 'phone' },
			{ text: 'On-Demand API Endpoints', icon: 'lightning' },
			{ text: 'Customizable Package', icon: 'box' },
		],
	},
];

class PricingPage extends Component {
	static async getInitialProps({ req }) {
		const result = await ssrFetch(req, GET_APIS_URL).then(res => res.json());
		const apiList = _.sortBy(
			_.map(result.result, it => {
				if (!it) return;
				let scopes = it.scopes || [];
				it.value = 0;
				it.basic = scopes.indexOf('basic') !== -1;
				if (it.basic) it.value -= 1;
				it.premium = it.basic || scopes.indexOf('premium') !== -1;
				if (it.premium) it.value -= 5;
				it.business = true;
				return it;
			}),
			'value'
		);
		return { namespacesRequired: [], mainContainer: { fluid: true }, apiList };
	}

	render() {
		const { t, apiList } = this.props;
		return (
			<div style={{ width: '100%' }}>
				<div style={{ background: 'white', padding: '20px 0', borderBottom: '2px solid #b5cc18' }}>
					<Container style={{ padding: '0 1rem' }}>
						<Header as="h2">
							<Icon name="payment" />
							<Header.Content>{t('pricing')}</Header.Content>
						</Header>
					</Container>
				</div>
				<Grid centered stackable style={{ padding: '20px 0' }}>
					{_.map(PriceList, (it, i) => (
						<Cell key={i} {...it} />
					))}
					<Grid.Column mobile={16} tablet={12} computer={12}>
						<Segment attached="top" textAlign="center" inverted color="blue" style={{ borderColor: '#d4d4d5' }}>
							<Header>Api Tiers List</Header>
						</Segment>
						<Table attached textAlign="center" celled fixed unstackable size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Api Name</Table.HeaderCell>
									<Table.HeaderCell>Basic</Table.HeaderCell>
									<Table.HeaderCell>Premium</Table.HeaderCell>
									<Table.HeaderCell>Enterprise</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							{ApiListTable(apiList)}
						</Table>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default withNamespaces()(PricingPage);
