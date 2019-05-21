import React, { Component } from 'react';
import { Header, Form, Grid, Tab, Icon } from 'semantic-ui-react';
import { rest } from '../lib/rest';
import { withNamespaces } from '../i18n';

class InformationPage extends Component {
	state = { name: '', surname: '', email: '', phone: '', company: '', submittedName: '', submittedEmail: '' };

	constructor(props) {
		super(props);
		let user = props.session.user;

		this.state = {
			name: user.name,
			surname: user.profile.surname || '',
			phone: user.profile.phone || '',
			email: user.email || '',
			company: user.profile.company || '',
			token: user.emailToken || '',
			sending: false,
			saved: 'save',
			color: 'black',
			icon: 'save',
			error_phone: false,

		};
	}
	/*
	componentDidMount() {
		fetch('/rest/user')
			.then(data => data.json())
			.then(console.log);
	} */
	handleChange = (e, { name, value }) => this.setState({ [name]: value, saved: 'save', color: 'black', icon: 'save' });

	handleSubmit = () => {
		const { name, surname, email, phone, company, password } = this.state;
		const reg = /^(\(\d{3}\)|\d{3})-?\d{3}-?\d{4}$/;
		if (this.state.sending) return;
		this.setState({ sending: true });
		if (reg.test(phone) == false) {
			rest('/rest/user/update', { name: this.state.name })
				.then(data => {
					this.setState({ sending: false, error_phone: true, saved: 'notsaved', color: 'red', icon: 'x'});
				})
				.catch(e => {
					console.error(e);
					this.setState({ sending: false });
				});
		} else {
			rest('/rest/user/update', { name: name, surname, phone, company, password })
				.then(data => {
					this.setState({ sending: false, successmessage: 'Başarıyla kaydedildi...', error_phone: false, saved: 'saved', color: 'teal', icon: 'check' });
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
		return (
			<Tab.Pane attached={false}>
				<Header as="h4">
					<Icon name="edit" />
					<Header.Content>{t('informations')}</Header.Content>
				</Header>
				<Grid className="container" textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Row>
						<Grid.Column width={13}>
							<Form onSubmit={this.handleSubmit}>
								<Form.Group unstackable widths="equal">
									<Form.Input type="text" label={t('username')} name="name" value={this.state.name} placeholder={t('username')} onChange={this.handleChange} />
									<Form.Input type="text" label={t('usersurname')} name="surname" value={this.state.surname} onChange={this.handleChange} placeholder={t('usersurname')} />
								</Form.Group>
								<Form.Group widths="equal">
									<Form.Input label={t('useremail')} name="email" value={this.state.email} readOnly />
									
									<Form.Input label={t('userphone')} name="phone" value={this.state.phone} placeholder={t('userphone')} onChange={this.handleChange} error={this.state.error_phone} />
								</Form.Group>
								<Form.Group widths="equal">
									<Form.Input label={t('usercompany')} name="company" placeholder={t('usercompany')} value={this.state.company} onChange={this.handleChange} />
								</Form.Group>
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
