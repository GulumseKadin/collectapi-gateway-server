import _ from 'lodash';
import React from 'react';
import { Container, Dropdown, Grid, Header, Segment, Button } from 'semantic-ui-react';
import ApiItem from '../components/api_item';
import { GET_APIS_URL, GET_TAGS_APIS_URL } from '../constants/constants';
import { SsrResponsive } from '../lib/ssr';
import { ssrFetch } from '../lib/rest';
import { i18n, withNamespaces, Link } from '../i18n';

const DropDownFilter = ({ categories, handleChange, displayCategory, allText }) => {
	const options = categories.map((value, i) => ({ key: i + 1, text: value, value }));
	options.unshift({ key: 0, text: allText, value: '' });

	return <Dropdown scrolling text={displayCategory || allText} icon="filter" labeled button className="icon" value={displayCategory} onChange={handleChange} options={options} />;
};

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			displayCategory: props.name,
			categories: props.categories,
			menuFixed: false,
			overlayFixed: false,
		};
		this.setCategory = this.setCategory.bind(this);
	}

	static async getInitialProps({ req, query }) {
		let { name } = query;

		console.log('tags detailx query :' + name);

		console.log('url :' + name ? GET_TAGS_APIS_URL + name : GET_TAGS_APIS_URL);

		const result = await ssrFetch(req, name ? GET_TAGS_APIS_URL + name : GET_TAGS_APIS_URL).then(res => res.json());

		let alltags = _.map(result.result, item => {
			return item.tags;
		});

		let flattags = _.uniq(_.flatten(alltags));
		//	flattags = _.pull(flattags, name);

		console.log('flattags :' + flattags);

		let categories = _.map(result.result, item => _.capitalize(item.category)).filter((x, i, a) => a.indexOf(x) === i);

		categories.sort();

		console.log('categories :' + categories);
		console.log('result.result :' + flattags);

		return { list: result.result, categories: flattags, namespacesRequired: [], tag: name, othertags: flattags };
	}

	setCategory(category) {
		console.log('setCategory ');
		this.setState({ displayCategory: category });
	}

	handleChange = (e, { value }) => this.setState({ displayCategory: value });

	render() {
		const { displayCategory, contextRef } = this.state;
		const { t, list = [], categories = [], tagOptions = [] } = this.props;
		const allText = t('all');
		return (
			<Container>
				<SsrResponsive maxWidth={SsrResponsive.onlyMobile.maxWidth}>
					<DropDownFilter {...{ categories, handleChange: this.handleChange, displayCategory, allText }} />
				</SsrResponsive>
				<Grid style={{ marginTop: 0 }} stackable>
					<Grid.Column tablet={6} computer={4} only="tablet computer">
						<Header as="h4" content="Tags" textAlign="center" />
						<Button.Group fluid vertical basic>
							{categories.map(category => (
								<Link key={category} as={'/tags/' + category} href={'/tags?name=' + category} passHref>
									<Button as="a" style={{ fontFamily: 'inherit', textAlign: 'left' }} key={category}>
										{category}
									</Button>
								</Link>
							))}
						</Button.Group>
					</Grid.Column>
					<Grid.Column mobile={16} tablet={10} computer={12}>
						<div style={{ marginTop: '1.2rem' }}>
							{_.map(list, (item, i) => {
								if (item) {
									return (
										<Grid.Column key={item.name + i} style={{ marginBottom: '1rem' }}>
											<Segment attached padded style={{ overflowY: 'auto' }}>
												<ApiItem item={item} />
											</Segment>
										</Grid.Column>
									);
								}
							})}
						</div>
					</Grid.Column>
				</Grid>
			</Container>
		);
	}
}

export default withNamespaces()(Home);
