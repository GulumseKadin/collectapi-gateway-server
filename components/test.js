import React, { Component } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
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
			apicount: '',
			sending: false,
		};
	}
	/*
	componentDidMount() {
		fetch('/rest/user')
			.then(data => data.json())
			.then(console.log);
	} */
	handleChange = (e, { name, value }) => this.setState({ [name]: value });

	handleSubmit = () => {
		const { name, surname, email, phone, company, password } = this.state;
		if (this.state.sending) return;
		this.setState({ sending: true });
		rest('/rest/user/update', { name: name, surname, phone, company, password })
			.then(data => {
				//throw new Error('neenenen')
				this.setState({ sending: false, successmessage: 'Başarıyla kaydedildi...' });
			})
			.catch(e => {
				console.error(e);
				this.setState({ sending: false });
			});
		//this.setState({ submittedfName: name, submittedlName: surname, submittedEmail: email, submittedPhone: phone, submittedCompany: company });
	};

	render() {
		const { t } = this.props;
		return (
			<Segment pilled>
				<Grid>
					<Grid.Row>
						<Grid.Column width={13} />
					</Grid.Row>
				</Grid>
			</Segment>
		);
	}
}

export default withNamespaces()(InformationPage);
