import React, { Component } from 'react';
import { Accordion, Icon, Table, Divider, Label, Segment, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { STRINGS, API_URL } from '../constants/constants';
import { withNamespaces } from '../i18n';
import ApiHighlight from './ApiHightlight';
import { SsrResponsive } from '../lib/ssr';

const beautifyRequest = data => {
	if (_.isString(data)) return API_URL + JSON.stringify(data, null, 2).slice(1, -1);
	else {
		data = _.clone(data);
		data.uri = API_URL + data.uri;
		return JSON.stringify(data, null, 2);
	}
};

const ApiResponse = ({ headers, response, request, t }) => (
	<React.Fragment>
		{request && <ApiHighlight t={t} title={t('request')} value={request} />}
		{response && <ApiHighlight t={t} title={t('response')} value={response} />}
	</React.Fragment>
);

const ApiParamTable = ({ list, color, t }) => (
	<React.Fragment>
		<Divider horizontal> {t('parameters')} </Divider>
		<Table celled striped color={color} fixed unstackable>
			<Table.Header>
				<Table.Row>
					<SsrResponsive as={Table.HeaderCell} {...SsrResponsive.onlyMobile} width={1}>
						{t('field')}
					</SsrResponsive>
					<SsrResponsive as={Table.HeaderCell} minWidth={SsrResponsive.onlyMobile.maxWidth + 1} width={2}>
						{t('field')}
					</SsrResponsive>
					<SsrResponsive as={Table.HeaderCell} {...SsrResponsive.onlyMobile} width={2}>
						{t('description')}
					</SsrResponsive>
					<SsrResponsive as={Table.HeaderCell} minWidth={SsrResponsive.onlyMobile.maxWidth + 1} width={7}>
						{t('description')}
					</SsrResponsive>
					<Table.HeaderCell width={1}>{t('type')}</Table.HeaderCell>
					<Table.HeaderCell width={1} textAlign="center">
						{t('header')}
					</Table.HeaderCell>
					<Table.HeaderCell width={1} textAlign="center">
						{t('required')}
					</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{_.map(list, (item, i) => (
					<Table.Row key={i}>
						<Table.Cell>{item.field}</Table.Cell>
						<Table.Cell>{item.description}</Table.Cell>
						<Table.Cell>{item.input_type}</Table.Cell>
						<Table.Cell textAlign="center">{item.header && <Icon color="green" name="checkmark" size="large" />}</Table.Cell>
						<Table.Cell textAlign="center">{item.required && <Icon color="green" name="checkmark" size="large" />}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	</React.Fragment>
);

class ApiAccordion extends Component {
	constructor(props) {
		super(props);
		const { t, items } = props;
		const panels = _.map(items, (data, index) => {
			const { end_point, method, parameters, examples, short_description } = data;
			let has_param = !!parameters.length;
			return {
				key: `panel-${index}`,
				title: {
					content: (
						<React.Fragment>
							<span style={{ textTransform: 'uppercase', fontSize: 12, color: method === 'post' ? 'rgb(27, 128, 50)' : 'rgb(74, 144, 226)', paddingRight: 10 }}>{method}</span>
							<span style={{ fontSize: 'larger', lineHeight: '26px' }}>{end_point}</span>
						</React.Fragment>
					),
				},
				content: {
					content: (
						<React.Fragment>
							<p>{short_description}</p>
							{has_param && <ApiParamTable {...props} color="olive" list={parameters} />}
							<Divider horizontal>{t('example')}</Divider>
							<ApiResponse {...props} {...examples[0]} />
						</React.Fragment>
					),
				},
			};
		});
		this.state = {
			panels,
		};
	}

	render() {
		return <Accordion styled fluid defaultActiveIndex={0} panels={this.state.panels} />;
	}
}

export default withNamespaces()(ApiAccordion);
