import React, { Component } from 'react';
import { Header, Icon, Form, Grid, Tab } from 'semantic-ui-react';
import { rest } from '../lib/rest';
import { withNamespaces } from '../i18n';
import { Field } from 'react-final-form';

class InformationPage extends Component {
	constructor(props) {
		super(props);
		let user = props.session.user;

		this.state = {
			name: user.name,
			email: user.email,
			password: user.profile.password || '',
			confirm: '',
			sending: false,
			saved: 'save',
			color: 'black',
			icon: 'save',
			error: '',
			notmatch1: false,
			notmatch2: false,
		};
	}
	/*
	componentDidMount() {
		fetch('/rest/user')
			.then(data => data.json())
			.then(console.log);
	} */
	handleChange = (e, { name, value }) => this.setState({ [name]: value, color: 'black', saved: 'save', icon: 'save'});

	handleSubmit = () => {
		const { password, confirm } = this.state;
		if (this.state.sending) return;
		if (!password || !confirm) {
			rest('/rest/user/update', { name: this.state.name })
				.then(data => {
					this.setState({ sending: false, error: 'password_dont_enter', notmatch1: !password, notmatch2: !confirm, saved: 'notsaved', color: 'red', icon: 'x' });
				})
				.catch(e => {
					console.error(e);
					this.setState({ sending: false });
				});
		}
		if (password !== confirm && confirm && password) {
			rest('/rest/user/update', { name: this.state.name })
				.then(data => {
					this.setState({ sending: false, error: 'error_password_notmatch', notmatch1: false, notmatch2: true, saved: 'notsaved', color: 'red', icon: 'x' });
				})
				.catch(e => {
					console.error(e);
					this.setState({ sending: false });
				});
		}
		if (password && password == confirm) {
			rest('/rest/user/update', { name: this.state.name, password })
				.then(data => {
					this.setState({ sending: false, error: '', notmatch1: false, notmatch2: false, saved: 'saved', color: 'teal', icon: 'check' });
				})
				.catch(e => {
					console.error(e);
					this.setState({ sending: false });
				});
			//this.setState({ submittedfName: name, submittedlName: surname, submittedEmail: email, submittedPhone: phone, submittedCompany: company });
		}
		this.setState({ sending: true });
		if (password && password == confirm) {
			rest('/rest/user/update', { name: this.state.name, password })
				.then(data => {
					this.setState({ sending: false, error: '', notmatch1: false, notmatch2: false, saved: 'saved', color: 'teal', icon: 'check' });
				})
				.catch(e => {
					console.error(e);
					this.setState({ sending: false });
				});
			//this.setState({ submittedfName: name, submittedlName: surname, submittedEmail: email, submittedPhone: phone, submittedCompany: company });
		}
	};

	render() {
		const { t } = this.props;
		const { password, confirm } = this.state;
		return (
			<Tab.Pane attached={false}>
				<Header as="h4">
					<Icon name="lock" />
					<Header.Content>{t('password')}</Header.Content>
				</Header>
				<Grid className="container" textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Row>
						<Grid.Column width={13}>
							<Form onSubmit={this.handleSubmit}>
								<Form.Group unstackable widths="equal">
									<Form.Input label={t('password')} name="password" type="password" placeholder={t('password')} onChange={this.handleChange} error={this.state.notmatch1} />
									<Form.Input label={t('confirm_password')} name="confirm" type="password" placeholder={t('confirm_password')} onChange={this.handleChange} error={this.state.notmatch2} />
								</Form.Group>
								<span>{t(this.state.error)}</span>
								<Form.Button style={{ float: 'right' }} icon={this.state.icon} color={this.state.color} content={t(this.state.saved)} loading={this.state.sending} />
							</Form>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Tab.Pane>
		);
	}
}

export default withNamespaces()(InformationPage);
