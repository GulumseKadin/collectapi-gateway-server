import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';
import { Message, Button, Form, Segment, Grid } from 'semantic-ui-react';
import { withNamespaces } from '../../i18n';

class ErrorPage extends React.Component {
	static async getInitialProps({ query }) {
		return {
			action: query.action || null,
			type: query.type || null,
			service: query.service || null,
		};
	}
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			phone: '',
			email: '',
			company: '',
			apicount: '',
			session: this.props.session,
		};
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleSignInSubmit = this.handleSignInSubmit.bind(this);
	}

	handleChange = (e, { name, value }) => this.setState({ [name]: value });

	handleSubmit = () => {
		const { name, email } = this.state;

		this.setState({ submittedName: name, submittedEmail: email });
	};

	handleEmailChange(event) {
		this.setState({
			email: event.target.value,
		});
	}

	handleSignInSubmit(event) {
		event.preventDefault();

		if (!this.state.email) return;

		NextAuth.signin(this.state.email)
			.then(() => {
				Router.push(`/auth/check-email?email=${this.state.email}`);
			})
			.catch(() => {
				Router.push(`/auth/error?action=signin&type=email&email=${this.state.email}`);
			});
	}

	render() {
		const { t } = this.props;
		if (this.props.action == 'signin' && this.props.type == 'oauth') {
			return (
				<div
					className="container"
					style={{
						margin: 'auto',
					}}
				>
					<Segment>
						<div className="container">
							<div className="text-center">
								<Message icon="exclamation" negative header={t('first_error_header')} content={t('first_error_content')} />
								<p className="lead">
									<Button id="submitButton" type="submit" className="btn btn-outline-primary" style={{ backgroundColor: '#1b1c1d', color: 'white' }} href="/auth">
										{t('first_error_button')}
									</Button>
								</p>
							</div>
						</div>
					</Segment>
					<Segment>
						<div className="row">
							<h4>{t('first_text1')}</h4>
							<p className="mb-3">{t('first_text2')}</p>
							<p className="mb-3">{t('first_text3')}</p>
							<p className="mb-5">{t('first_text4')}</p>
							<h4>{t('first_text5')}</h4>
							<p className="mb-0">
							{t('first_text6')}
							</p>
						</div>
					</Segment>
				</div>
			);
		} else if (this.props.action == 'signin' && this.props.type == 'token-invalid') {
			return (
				<div
					className="container"
					style={{
						margin: 'auto',
					}}
				>
					<Segment>
						<form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSignInSubmit}>
							<input name="_csrf" type="hidden" value={this.state.session.csrfToken} />
							<Message icon="time" negative header={t('invalid_code')} content={t('login_timeup')} />
							<Form.Input fluid icon="at" iconPosition="left" placeholder={t('email_address')} id="email" className="form-control" value={this.state.email} onChange={this.handleEmailChange} />

							<Button id="submitButton" type="submit" className="btn btn-outline-primary" style={{ backgroundColor: '#1b1c1d', color: 'white' }} fluid size="large">
								{t('resend_code')}
							</Button>
						</form>
					</Segment>
				</div>
			);
		} else {
			return (
				<div
					className="container"
					style={{
						margin: 'auto',
					}}
				>
					<Segment>
						<div className="container">
							<div className="text-center">
								<Message icon="x" negative header={t('third_error_header')} content={t('third_error_content')} />
								<p className="lead">
									<Button id="submitButton" type="submit" className="btn btn-outline-primary" style={{ backgroundColor: '#1b1c1d', color: 'white' }} fluid size="large" href="/auth">
										{t('login')}
									</Button>
								</p>
							</div>
						</div>
					</Segment>
				</div>
			);
		}
	}
}

export default withNamespaces()(ErrorPage);
