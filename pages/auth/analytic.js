import React, { Component } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Loader, Grid, Container, Header, Icon, Segment, Dropdown, Button, Popup, Table, Label, Message } from 'semantic-ui-react';
import { rest } from '../../lib/rest';
import { withNamespaces, Link } from '../../i18n';
import randomMC from 'random-material-color';
import _ from 'lodash';
import moment from 'moment';
import Picker from '../../components/DateRangePicker';
import { PRICE_PER_CALL } from '../../constants/constants';

const PriceFormat = price => parseFloat(price.toFixed(3));

const barOptions = {
	scales: {
		xAxes: [{ stacked: true }],
		yAxes: [{ stacked: true }],
	},
	tooltips: {
		mode: 'index',
		intersect: false,
		filter: a => a.yLabel,
	},
	hover: {
		mode: 'nearest',
		intersect: true,
	},
	legend: {
		display: false,
	},
};

const lineOptions = {
	tooltips: {
		mode: 'index',
		intersect: false,
		filter: a => a.yLabel,
	},
	hover: {
		mode: 'nearest',
		intersect: true,
	},
	legend: {
		display: false,
	},
};
const pieOptions = {
	legend: {
		display: false,
	},
	responsive: true,
};

const ChartWrap = props => (
	<Grid.Column width={props.width}>
		<Header as="h4" attached="top">
			<Icon name={props.icon || 'chart bar'} />
			<Header.Content>{props.title}</Header.Content>
		</Header>
		<Segment attached>{props.children}</Segment>
	</Grid.Column>
);
const TableBodyGenerate = data => (
	<Table.Body>
		{_.map(data, ({ api, count, minPerCall, maxPerCall, totalCost }) => (
			<Table.Row key={api}>
				<Table.Cell style={{ textTransform: 'capitalize', color: randomMC.getColor({ text: api }) }}>{api}</Table.Cell>
				<Table.Cell>{count}</Table.Cell>
				<Table.Cell>{minPerCall === maxPerCall ? minPerCall : minPerCall + '-' + maxPerCall}$</Table.Cell>
				<Table.Cell>{totalCost}$</Table.Cell>
			</Table.Row>
		))}
	</Table.Body>
);

const TableBodyGenerate2 = data => (
	<Table.Body>
		{_.map(data, ({ api, endpointCosts, count, totalCost }) =>
			_.map(endpointCosts, ({ endpoint, count, perCall, totalCost }) => (
				<Table.Row key={endpoint}>
					<Table.Cell style={{ textTransform: 'capitalize', color: randomMC.getColor({ text: api }) }}>{api}</Table.Cell>
					<Table.Cell style={{ textTransform: 'capitalize', color: randomMC.getColor({ text: endpoint }), textAlign: 'left' }}>{endpoint}</Table.Cell>
					<Table.Cell>{count}</Table.Cell>
					<Table.Cell>{perCall}$</Table.Cell>
					<Table.Cell>{totalCost}$</Table.Cell>
				</Table.Row>
			))
		)}
	</Table.Body>
);
const CardWrap = props => (
	<Grid.Column width={props.width}>
		<Segment textAlign="center" style={{ paddingTop: 50 }} size="massive">
			<Label size="large" color={props.color} attached="top">
				{props.title}
			</Label>
			{props.data}
		</Segment>
	</Grid.Column>
);
class Analytic extends Component {
	state = {
		loading: true,
		filter: '',
		type: 'day',
		startDate: moment()
			.add(-14, 'day')
			.toDate(),
		endDate: new Date(),
		open: false,
		column: null,
		direction: null,
	};

	static async getInitialProps() {
		return { namespacesRequired: ['analytics'], mainContainer: { fluid: true } };
	}

	componentDidMount() {
		this.load();
	}
	async load() {
		let { endDate, type, startDate, filter, priceTable } = this.state;
		const { t } = this.props;
		this.lastLoad = { endDate, type, startDate, filter };
		let request = { consumerHeader: this.props.session.user.gwid, type, startDate: startDate.valueOf(), endDate: endDate.valueOf() };
		const results = await rest('/rest/user/analytics/getRequestsInfoByApi', request).then();
		priceTable = priceTable || (await rest('/rest/user/analytics/getPriceTable', request).then());
		const response = parser(results, request.startDate, request.endDate, filter, priceTable);
		const filterList = response.apiChartData.apiLabels.map((value, i) => ({ key: i + 1, text: value, value }));
		filterList.unshift({ key: 0, text: t('all'), value: '' });
		this.setState({ loading: false, ...response, filterList, lastResult: results, priceTable });
	}
	loadOffline() {
		let { endDate, type, startDate, filter, lastResult } = this.state;
		this.lastLoad = { endDate, type, startDate, filter };
		const response = parser(lastResult, startDate, endDate, filter);
		this.setState({ loading: false, ...response });
	}
	handleSort = selected => () => {
		const { column, apiCostList, direction } = this.state;
		if (selected !== column) {
			this.setState({
				column: selected,
				apiCostList: _.sortBy(apiCostList, [selected]),
				direction: 'ascending',
			});
			return;
		}
		this.setState({
			apiCostList: apiCostList.reverse(),
			direction: direction === 'ascending' ? 'descending' : 'ascending',
		});
	};
	filterChange = (e, { value }) => {
		this.setState({ filter: value });
	};

	dateChange = ({ selection }) => this.setState({ startDate: selection.startDate, endDate: selection.endDate });

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	refresh = () => {
		this.checkUpdate(this.state, ['endDate', 'startDate']);
	};

	checkUpdate(state, list) {
		if (!state) state = this.state;
		let compare = this.lastLoad;

		let checkList = list || ['type', 'filter'];

		for (let i = 0; i < checkList.length; i++) {
			const key = checkList[i];
			if (state[key] !== compare[key]) {
				if (key === 'filter') return this.loadOffline();
				return this.load();
			}
		}
	}

	componentWillUpdate = (nextProps, nextState) => {
		this.checkUpdate(nextState);
	};

	btnClick = (e, { name }) => {
		this.setState({ type: name });
	};

	render() {
		const { filterList = [], filter, open, endDate, startDate, type, column, direction, apiCostList } = this.state;
		const { t, i18n } = this.props;
		return (
			<div style={{ width: '100%' }}>
				<div style={{ background: 'white', padding: '20px 0', borderBottom: '2px solid #b5cc18' }}>
					<Container style={{ padding: '0 1rem' }}>
						<Header as="h2">
							<Icon name="chart pie" />
							<Header.Content>{t('analytics_usage')}</Header.Content>
						</Header>

						<div style={{ display: this.props.session.user.gwid ? 'block' : 'none' }}>
							<Dropdown scrolling text={filter || t('all')} icon="filter" labeled button className="icon" value={filter} onChange={this.filterChange} options={filterList} />

							<Popup
								trigger={
									<Button
										primary
										content={`${moment(startDate)
											.locale(i18n.language)
											.format('MMM DD, YYYY')} - ${moment(endDate)
											.locale(i18n.language)
											.format('MMM DD, YYYY')}`}
										floated="right"
									/>
								}
								content={<Picker dateChange={this.dateChange} startDate={startDate} endDate={endDate} />}
								on="click"
								onClose={this.refresh}
							/>
							<Button.Group floated="right" style={{ display: 'none' }}>
								<Button active={type === 'day'} name="day" onClick={this.btnClick}>
									Günlük
								</Button>
								<Button active={type === 'month'} name="month" onClick={this.btnClick}>
									Aylık
								</Button>
							</Button.Group>
						</div>
					</Container>
				</div>

				<Container style={{ padding: '2rem 0' }}>{this.renderAll()}</Container>
			</div>
		);
	}

	renderAll() {
		if (!this.props.session.user.gwid)
			return (
				<Message warning style={{ textAlign: 'center' }}>
					<Message.Header>You don't have any active gateway account.</Message.Header>
					Please create an token at
					<Link href="/auth?tab=token">
						<a> api token section.</a>
					</Link>
				</Message>
			);
		if (this.state.loading) return <Loader active inline="centered" />;
		const { filterList = [], filter, open, endDate, startDate, type, column, direction, apiCostList } = this.state;
		const { t } = this.props;
		return (
			<>
				<Grid stackable columns={2} style={{ width: '100%', margin: 0 }}>
					{!this.state.totalRequest && <Message warning icon="chart line" content={t('empty_result')} />}
					<CardWrap width={4} title={t('total_request')} color="orange" data={this.state.totalRequest} />
					<CardWrap width={4} title={t('total_cost')} color="green" data={this.state.totalCost + '$'} />
					<CardWrap width={4} title={t('used_api_count')} color="teal" data={this.state.apiCostList.length} />
					<CardWrap width={4} title={t('used_endpoint_count')} color="violet" data={this.state.endpointCount} />

					<ChartWrap width={16} title={t('all_usage')}>
						<Bar data={this.state.apiChartData} options={barOptions} />
					</ChartWrap>
					<Grid.Column width={16}>
						<Table sortable celled unstackable fixed striped selectable>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell sorted={column === 'api' ? direction : null} onClick={this.handleSort('api')}>
										{t('api')}
									</Table.HeaderCell>
									<Table.HeaderCell sorted={column === 'count' ? direction : null} onClick={this.handleSort('count')}>
										{t('total_request')}
									</Table.HeaderCell>
									<Table.HeaderCell sorted={column === 'perCall' ? direction : null} onClick={this.handleSort('perCall')}>
										{t('per_call')}
									</Table.HeaderCell>
									<Table.HeaderCell sorted={column === 'totalCost' ? direction : null} onClick={this.handleSort('totalCost')}>
										{t('total_cost')}
									</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							{TableBodyGenerate(this.state.apiCostList)}
							<Table.Footer>
								<Table.Row>
									<Table.HeaderCell style={{ fontWeight: 700 }}>{t('total')}</Table.HeaderCell>
									<Table.HeaderCell style={{ fontWeight: 700 }}>{this.state.totalRequest}</Table.HeaderCell>
									<Table.HeaderCell style={{ fontWeight: 700 }} />
									<Table.HeaderCell style={{ fontWeight: 700 }}>{this.state.totalCost}$</Table.HeaderCell>
								</Table.Row>
							</Table.Footer>
						</Table>
					</Grid.Column>
					<ChartWrap title={t('total_usage_graph')}>
						<Line data={this.state.generalChartData} options={lineOptions} />
					</ChartWrap>
					<ChartWrap title={t('api_graph')}>
						<Line data={this.state.apiChartData} options={lineOptions} />
					</ChartWrap>
					<ChartWrap width={16} title={filter ? t('endpoint_pie') : t('api_pie')}>
						<Pie data={filter ? this.state.endpointPieData : this.state.apiPieData} options={pieOptions} />
					</ChartWrap>

					<ChartWrap title={t('endpoint_graph')}>
						<Bar data={this.state.endpointChartData} options={barOptions} />
					</ChartWrap>
					<ChartWrap title={t('endpoint_graph')}>
						<Line data={this.state.endpointChartData} options={lineOptions} />
					</ChartWrap>

					<Grid.Column width={16}>
						<Table definition celled fixed unstackable striped selectable compact textAlign="center">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell width={2}>{t('api')}</Table.HeaderCell>
									<Table.HeaderCell>{t('endpoint')}</Table.HeaderCell>
									<Table.HeaderCell>{t('total_request')}</Table.HeaderCell>
									<Table.HeaderCell>{t('per_call')}</Table.HeaderCell>
									<Table.HeaderCell>{t('total_cost')}</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							{TableBodyGenerate2(this.state.apiCostList)}
							<Table.Footer>
								<Table.Row>
									<Table.HeaderCell style={{ fontWeight: 700 }}>{t('total')}</Table.HeaderCell>
									<Table.HeaderCell style={{ fontWeight: 700 }} />
									<Table.HeaderCell style={{ fontWeight: 700 }}>{this.state.filteredApi.count}</Table.HeaderCell>
									<Table.HeaderCell style={{ fontWeight: 700 }} />
									<Table.HeaderCell style={{ fontWeight: 700 }}>{this.state.filteredApi.totalCost}$</Table.HeaderCell>
								</Table.Row>
							</Table.Footer>
						</Table>
					</Grid.Column>
				</Grid>
			</>
		);
	}
}

function parser(results, start, end, filter, priceTable) {
	let totalRequest = 0;
	let a = moment(start),
		b = moment(end);
	let dateList = [],
		labels = [],
		datasets = [];
	let apiDatasets = [],
		endpointDatasets = [];
	let apiLabels = [],
		endpointLabels = [];
	let apiCostList = [],
		endpointCount = 0,
		perCall = PRICE_PER_CALL;
	let apiCounts = [],
		endpointCounts = [];
	let filteredApi = {};
	for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
		let label = m.format('DD-MM');
		labels.push(label);
		let day = m.startOf('day').valueOf();
		dateList.push(day);
	}
	let generalDatasets = _.fill(Array(dateList.length), 0);

	for (let j = 0; j < results.length; j++) {
		const { _id, total, dates } = results[j];
		totalRequest += total;
		apiCounts.push(total);
		let endpointCosts = [];
		// chart data generate
		let data = {
			label: _id,
			backgroundColor: randomMC.getColor({ text: _id }),
			data: _.fill(Array(dateList.length), 0),
			fill: false,
		};
		let _endpoints = {};
		_.each(dates, ({ date, count, endpoints }) => {
			let day = moment(date)
				.startOf('day')
				.valueOf();
			let index = dateList.indexOf(day);
			if (index !== -1) {
				data.data[index] += count;
				generalDatasets[index] += count;
			}
			_.each(endpoints, ({ endpoint, count }) => {
				if (!_endpoints[endpoint]) {
					endpointCount += 1;
					_endpoints[endpoint] = {
						label: _id + ' - ' + endpoint,
						backgroundColor: randomMC.getColor({ text: endpoint }),
						data: _.fill(Array(dateList.length), 0),
						fill: false,
					};
				}
				_endpoints[endpoint].data[index] += count;
			});
		});
		apiLabels.push(_id);
		let apiCost = 0;
		let minPerCall = 999,
			maxPerCall = 0;
		if (!filter || filter === _id) {
			apiDatasets.push(data);
			_.map(_endpoints, (v, k) => {
				endpointDatasets.push(v);
				endpointLabels.push(k);
				let priceRow = _.find(priceTable, ({ endpoint, api }) => {
					return api === _id && _.endsWith(k, endpoint);
				});

				let perCall = (priceRow && (priceRow.pricing || priceRow.api_pricing)) || PRICE_PER_CALL;
				let count = _.sum(v.data);
				let totalCost = count * perCall;
				if (minPerCall > perCall) minPerCall = perCall;
				if (maxPerCall < perCall) maxPerCall = perCall;
				apiCost += totalCost;
				endpointCosts.push({ endpoint: k, count, perCall, totalCost: PriceFormat(totalCost) });
				endpointCounts.push(count);
			});
			filteredApi = { count: total, totalCost: PriceFormat(apiCost) };
		}

		apiCostList.push({ api: _id, count: total, minPerCall, maxPerCall, totalCost: PriceFormat(apiCost), endpointCosts });
	}

	let endpointChartData = { labels, endpointLabels, datasets: endpointDatasets };
	let apiChartData = { labels, apiLabels, datasets: apiDatasets };
	let generalChartData = { labels, datasets: [{ data: generalDatasets, label: 'Total Request', fill: false, backgroundColor: randomMC.getColor({ text: 'Total Request' }) }] };
	let totalCost = PriceFormat(_.sumBy(apiCostList, 'totalCost'));
	let apiPieData = {
		datasets: [
			{
				data: apiCounts,
				backgroundColor: _.map(apiLabels, text => randomMC.getColor({ text })),
			},
		],
		labels: apiLabels,
	};
	let endpointPieData = {
		datasets: [
			{
				data: endpointCounts,
				backgroundColor: _.map(endpointLabels, text => randomMC.getColor({ text })),
			},
		],
		labels: endpointLabels,
	};
	if (!filter) filteredApi = { count: totalRequest, totalCost };
	return { endpointChartData, apiChartData, generalChartData, totalRequest, apiCostList, totalCost, endpointCount, apiPieData, endpointPieData, filteredApi };
}
export default withNamespaces('analytics')(Analytic);
