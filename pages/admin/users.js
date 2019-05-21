import React from 'react';
import withAdminLayout from '../../components/AdminLayout';
import { withNamespaces } from '../../i18n';
import { Header, Icon, Segment, Button, Checkbox, Table, List, Input, Dimmer, Loader } from 'semantic-ui-react';
import { ssrFetch, rest } from '../../lib/rest';
import _ from 'lodash';

class UserScopeEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allscopes: null,
			scopes: null,
			loading: true,
			saving: false,
		};
		this.save = this.save.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	async getData() {
		let allscopes = await fetch('/rest/admin/gw/scopes').then(it => it.json());
		let userscopes = await fetch('/rest/admin/gwtoken/' + this.props.user._id).then(it => it.json());
		userscopes = (userscopes && userscopes.gwtoken && userscopes.gwtoken.scopes) || [];
		let scopes = {};
		_.each(allscopes.scopes, it => {
			if (it === 'admin') return;
			scopes[it] = userscopes.indexOf(it) !== -1;
		});
		this.setState({ loading: false, scopes });
	}

	async save() {
		if (this.state.saving) return;
		try {
			this.setState({ saving: true });
			let scopes = [];
			_.each(this.state.scopes, (val, key) => {
				if (val) scopes.push(key);
			});
			let result = await rest(`/rest/admin/gwuser/${this.props.user._id}/scopes`, { scopes });
			this.setState({ saving: false, save: 'Saved' });
		} catch (error) {
			this.setState({ saving: false, save: error.message });
		}
	}

	toggle = (e, { label, checked }) => {
		this.setState({
			scopes: {
				...this.state.scopes,
				[label]: checked,
			},
		});
	};

	render() {
		if (this.state.loading)
			return (
				<Loader inline="centered" active>
					Loading
				</Loader>
			);
		return (
			<div>
				<Header as="h4">
					<Icon name="options" />
					<Header.Content>Scope Settings</Header.Content>
				</Header>
				<Segment>
					<List>
						{_.map(this.state.scopes, (val, key) => (
							<List.Item key={key}>
								<Checkbox label={key} onChange={this.toggle} checked={val} />
							</List.Item>
						))}
					</List>
				</Segment>
				<Button loading={this.state.saving} onClick={this.save}>
					Save
				</Button>
				{this.state.save && <div>{this.state.save}</div>}
			</div>
		);
	}
}

class UserInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = { user: props.user };
		if (!props.user.profile) props.user.profile = {};
	}

	async generate() {
		if (this.state.gen) return;
		this.setState({ gen: true });
		let { user, token } = await fetch('/rest/admin/gw/generate/' + this.state.user._id).then(it => it.json());
		this.setState({ gen: false, user: { ...this.state.user, gwid: user.gwid } });
	}

	render() {
		const { scopes } = this.props;
		const { user } = this.state;
		return (
			<div>
				<Header as="h4">
					<Icon name="user" />
					<Header.Content>User Info</Header.Content>
				</Header>
				<Table fixed definition singleLine>
					<Table.Body>
						<Table.Row>
							<Table.Cell width={3}>Id</Table.Cell>
							<Table.Cell>{user._id || ''}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>GatewayId</Table.Cell>
							<Table.Cell>{user.gwid || <button onClick={this.generate.bind(this)}>{this.state.gen ? 'loading...' : 'Generate'}</button>}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Name</Table.Cell>
							<Table.Cell>{user.profile.displayName || user.name || ''}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Email</Table.Cell>
							<Table.Cell>{user.email || ''}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Phone</Table.Cell>
							<Table.Cell>{user.profile.phone || ''}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Company</Table.Cell>
							<Table.Cell>{user.profile.company || ''}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Joined at</Table.Cell>
							<Table.Cell>{new Date(user.created_at || '').toLocaleDateString()}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
				{user.gwid && <UserScopeEditor {...this.props} />}
			</div>
		);
	}
}

const userToName = ({ name, email, profile = {} }) => {
	let fullname = name;
	if (profile.name && profile.surname) fullname = `${profile.name} ${profile.surname}`;
	return fullname || email;
};

const userToDescription = ({ name, email, profile = {} }) => {
	let desc = '';
	if (email) desc += `${email}`;
	if (profile.company) desc += ` - ${profile.company}`;
	return desc.replace(/^[-\s]+|[-\s]+$/g, '');
};

class AdminUserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: null,
			filter: '',
			loading: false,
		};
	}

	onFilter = () => {
		clearTimeout(this.filter);
		if (!this.state.loading) this.setState({ loading: true });
		this.filter = setTimeout(() => {
			if (!this.state.filter) this.setState({ loading: false, list: null });
			else this.setState({ loading: false, list: _.filter(this.props.users, ({ name = '', email = '' }) => (name + email).indexOf(this.state.filter) !== -1) });
		}, 100);
	};

	onChange = (e, { name, value }) => {
		this.setState({ filter: value });
		this.onFilter();
	};

	render() {
		return (
			<div>
				<Header as="h4">
					<Icon name="users" />
					<Header.Content>User List</Header.Content>
				</Header>
				<Input value={this.state.filter} placeholder="Search..." icon="search" iconPosition="left" fluid onChange={this.onChange} />
				<List selection verticalAlign="middle" style={{ position: 'relative' }}>
					<Dimmer active={this.state.loading} inverted>
						<Loader size="large">Loading</Loader>
					</Dimmer>
					{_.map(this.state.list || this.props.users, it => (
						<List.Item key={it.email}>
							<a href={'/admin/users?uid=' + it._id}>
								<List.Content>
									<List.Header>{userToName(it)}</List.Header>
									<List.Description>{userToDescription(it)}</List.Description>
								</List.Content>
							</a>
						</List.Item>
					))}
				</List>
			</div>
		);
	}
}

function AdminIndex(props) {
	if (props.user) return <UserInfo {...props} />;
	return <AdminUserList {...props} />;
}

AdminIndex.getInitialProps = async ({ req, query }) => {
	let props = { namespacesRequired: [] };
	if (!query.uid) {
		let users = await ssrFetch(req, '/rest/admin/users').then(it => it.json());
		props.users = users.users;
	} else {
		let user = await ssrFetch(req, '/rest/admin/user/' + query.uid).then(it => it.json());
		props.user = user;
	}
	return props;
};

export default withNamespaces()(withAdminLayout(AdminIndex));
