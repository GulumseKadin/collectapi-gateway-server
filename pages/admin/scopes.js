import withAdminLayout from '../../components/AdminLayout';
import { withNamespaces } from '../../i18n';
import { Container, Dropdown, Grid, Confirm, Header, Input, Icon, List, Segment, Button } from 'semantic-ui-react';
import { ssrFetch } from '../../lib/rest';
import _ from 'lodash';

class AdminIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = { input: '', open: false, loading: false, scopes: _.filter(props.scopes, it => it !== 'admin') || [] };
	}

	static async getInitialProps({ req }) {
		let scopes = await ssrFetch(req, '/rest/admin/gw/scopes').then(it => it.json());
		return { scopes: scopes.scopes, namespacesRequired: [] };
	}

	add = async () => {
		if (!this.state.input || this.state.loading || this.state.input === 'admin') return;
		this.setState({ loading: true });
		let result = await fetch('/rest/admin/gw/scopes/add/' + this.state.input).then(it => it.json());
		if (result && result.success) {
			this.setState({ loading: false, scopes: [...this.state.scopes, this.state.input], input: '' });
		} else {
			this.setState({ loading: false });
		}
	};

	show = (e, { name }) => {
		if (name)
			this.setState({
				open: true,
				selected: name,
			});
	};

	close = () => {
		this.setState({ open: false });
	};

	confirm = async () => {
		try {
			let result = await fetch('/rest/admin/gw/scopes/remove/' + this.state.selected).then(it => it.json());
			if (result && result.success) {
				this.setState({ open: false, scopes: _.filter(this.state.scopes, it => it !== this.state.selected) });
			} else this.setState({ open: false });
		} catch (error) {
			this.setState({ open: false });
		}
	};

	onChange = (e, { value }) => this.setState({ input: value });

	render() {
		return (
			<div>
				<Header as="h4">
					<Icon name="options" />
					<Header.Content>Global Scopes Settings</Header.Content>
				</Header>
				<Segment>
					<List divided verticalAlign="middle">
						{_.map(this.state.scopes, it => (
							<List.Item key={it}>
								{!/^(admin|basic)$/.test(it) && (
									<List.Content floated="right">
										<Button onClick={this.show} name={it}>
											Delete
										</Button>
									</List.Content>
								)}
								<List.Header style={{ lineHeight: '36px' }}>#{it}</List.Header>
							</List.Item>
						))}
					</List>
					<Confirm
						open={this.state.open}
						confirmButton="Delete"
						header={`Delete #${this.state.selected} Scope`}
						content={`Do you want to delete #${this.state.selected} scope?`}
						onCancel={this.close}
						onConfirm={this.confirm}
					/>
				</Segment>

				<Header as="h4">
					<Icon name="add" />
					<Header.Content>Add New Scope</Header.Content>
				</Header>
				<Input value={this.state.input} placeholder="scope_name" onChange={this.onChange} action={{ color: 'green', loading: this.state.loading, icon: 'add', content: 'Add', onClick: this.add }} />
			</div>
		);
	}
}

export default withNamespaces()(withAdminLayout(AdminIndex));
