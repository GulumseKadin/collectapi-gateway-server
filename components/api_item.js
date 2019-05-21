import React from 'react';
import { Item, Label, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { STRINGS } from '../constants/constants';
import { i18n, withNamespaces, Link } from '../i18n';
import { SsrResponsive } from '../lib/ssr';

const item_description_style = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	WebkitLineClamp: '2',
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
	marginBottom: '1rem',
};

class ApiItem extends React.Component {
	generateTags = tags => {
		return _.map(tags, (t, i) => (
			<Label as="a" key={i} basic>
				{t}
			</Label>
		));
	};
	generateImageLabel = (src, tags) => {
		const label = {
			size: 'mini',
			corner: 'left',
			as: 'a',
		};
		//let show_tag = false;
		let tag = tags && tags[0];
		if (tag === 'popular') {
			//show_tag = true;
			label.color = 'red';
		}
		return <SsrResponsive minWidth={SsrResponsive.onlyTablet.minWidth} as={Item.Image} className="api_item" size="tiny" src={src} />;
	};
	handleClick = e => {};
	generateLink = (name, group_id) => {
		if (!_.endsWith(name, 'api')) name += ' api';
		return `/api/${group_id}/${_.kebabCase(name)}`;
	};
	render() {
		if (!this.props.item) return;
		let { name, description, tags, group_id, image_url, scopes } = this.props.item;
		let urlName = _.kebabCase(name);
		const { t } = this.props;
		return (
			<Item.Group>
				<Item>
					{this.generateImageLabel(image_url, tags)}
					<Item.Content>
						<Item.Header>
							<Link as={`/api/${group_id}/${urlName}`} href={`/api?group=${group_id}`}>
								<a className="button-main">{name}</a>
							</Link>
						</Item.Header>
						{/* <Item.Meta>{developer}</Item.Meta> */}
						<Item.Description style={item_description_style}>{description}</Item.Description>
						<Item.Extra>
							{/* {this.generateTags(tags)} */}
							<Link as={`/api/${group_id}/${urlName}`} href={`/api?group=${group_id}`} passHref>
								<Button as="a" primary floated="right">
									{t('show')}
									<Icon name="right chevron" />
								</Button>
							</Link>
						</Item.Extra>
					</Item.Content>
				</Item>
			</Item.Group>
		);
	}
}

export default withNamespaces()(ApiItem);
