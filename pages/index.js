import _ from 'lodash';
import React from 'react';
import { Container, Dropdown, Grid, Header, Segment, Button } from 'semantic-ui-react';
import { withNamespaces } from '../i18n';
import ApiItem from '../components/api_item';
import { GET_APIS_URL } from '../constants/constants';
import { SsrResponsive } from '../lib/ssr';
import { ssrFetch } from '../lib/rest';

const DropDownFilter = ({ categories, handleChange, displayCategory, allText }) => {
	const options = categories.map((value, i) => ({ key: i + 1, text: value, value }));
	options.unshift({ key: 0, text: allText, value: '' });

	return <Dropdown scrolling text={displayCategory || allText} icon="filter" labeled button className="icon" value={displayCategory} onChange={handleChange} options={options} />;
};

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			displayCategory: '',
			menuFixed: false,
			overlayFixed: false,
		};
		this.setCategory = this.setCategory.bind(this);
	}

	static async getInitialProps({ req }) {
		const result = await ssrFetch(req, GET_APIS_URL).then(res => res.json());
		let categories = _.map(result.result, item => _.capitalize(item.category)).filter((x, i, a) => a.indexOf(x) === i);
		categories.sort();
		return { list: result.result, categories, namespacesRequired: [] };
	}

	setCategory(category) {
		this.setState({ displayCategory: category });
	}

	handleChange = (e, { value }) => this.setState({ displayCategory: value });

	render() {
		const { displayCategory, contextRef } = this.state;
		const { t, list = [], categories = [], tagOptions = [] } = this.props;
		const allText = t('all');
		return (
			<Container>
				<SsrResponsive maxWidth={SsrResponsive.onlyMobile.maxWidth} >
					<DropDownFilter {...{ categories, handleChange: this.handleChange, displayCategory, allText }} />
				</SsrResponsive>
				<Grid style={{ marginTop: 0 }} stackable>
					<Grid.Column tablet={6} computer={4} only="tablet computer">
						<Header as="h4" content={t('categories')} textAlign="center" />
						<Button.Group fluid vertical basic>
							<Button style={{ fontFamily: 'inherit', textAlign: 'left' }} active={!displayCategory} onClick={() => this.setCategory('')}>
								{allText}
							</Button>
							{categories.map(category => (
								<Button style={{ fontFamily: 'inherit', textAlign: 'left' }} active={displayCategory === category} key={category} onClick={() => this.setCategory(category)}>
									{category}
								</Button>
							))}
						</Button.Group>
					</Grid.Column>
					<Grid.Column mobile={16} tablet={10} computer={12}>
						<div style={{ marginTop: '1.2rem' }}>
							{_.map(list, (item, i) => {
								if (item && (_.capitalize(item.category) === displayCategory || !displayCategory)) {
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
