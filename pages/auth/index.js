import React from 'react';
import Router from 'next/router';
import { NextAuth } from 'next-auth/client';
import { Button, Form, Grid, Header, Image, Segment, Icon, Card, Tab, Container, GridColumn } from 'semantic-ui-react';
import FormContainer from '../../components/TokenPage';
import InformationTab from '../../components/UserInfo';
import PasswordTab from '../../components/PasswordPage';
import { withNamespaces, Link } from '../../i18n';
import NoSSR from 'react-no-ssr';
import moment from 'moment';

const validate = values => {
	const errors = {};
	if (!values.email) {
		errors.email = 'Required';
	}
	return errors;
};

class Profile extends React.Component {
	static async getInitialProps({ req, query }) {
		return {
			query,
			linkedAccounts: await NextAuth.linked({ req }),
			providers: await NextAuth.providers({ req }),
			namespacesRequired: [],
			mainContainer: { fluid: true },
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
		const { t, i18n, query, session } = this.props;
		const tabs = { token: 1, accounts: 2 };
		let defaultIndex = tabs[query.tab] || 0;

		const panes = [
			{
				menuItem: t('informations'),
				render: props => {
					return <InformationTab session={session} />;
				},
			},/*
			{
				menuItem: t('password'),
				render: props => {
					return <PasswordTab session={session} />;
				},
			},*/
			{
				menuItem: 'Api Token',
				render: props => {
					return <FormContainer session={session} />;
				},
			},
			{
				menuItem: t('linked_account'),
				render: props => {
					return <LinkAccounts {...this.props} />;
				},
			},
		];
		if (this.props.session.user) {
			return (
				<div style={{ width: '100%' }}>
					<div style={{ background: 'white', padding: '20px 0', borderBottom: '2px solid #b5cc18' }}>
						<Container style={{ padding: '1rem 0' }}>
							<Header as="h2">
								<Icon name="user" />
								<Header.Content>{t('profile')}</Header.Content>
							</Header>
						</Container>
					</div>
					<Container style={{ padding: '1rem 0' }}>
						<Segment>
							<Grid>
								<Grid.Row>
									<Grid.Column width={3}>
										<div>
											<Card>
												<Image style={{ background: 'black' }} src="../../static/images/knot/knotapi@0,25x.png" />
												<Card.Content>
													<Card.Header>{this.props.session.user.name ? this.props.session.user.name : 'Enter your name'}</Card.Header>

													<Card.Meta>
														{t('joined', {
															year: this.props.session.user.created_at
																? moment(this.props.session.user.created_at)
																		.locale(i18n.language || 'en')
																		.format('LL')
																: '2019',
														})}
													</Card.Meta>
												</Card.Content>
											</Card>
										</div>
									</Grid.Column>
									<Grid.Column width={13}>
										<Tab defaultActiveIndex={defaultIndex} menu={{ attached: false, tabular: false }} panes={panes} />
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</Segment>
					</Container>
				</div>
			);
		} else {
			return (
				<Grid className="container" textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 450 }}>
						<div className="row">
							<div className="col-sm-6 mr-auto ml-auto">
								<div className="card mt-3 mb-3">
									<Header as="h2" color="black" textAlign="center">
										<br />
										<Segment>
											<div style={{ background: '#1b1c1d', borderRadius: 3 }}>
												<Image style={{ margin: 'auto', background: '#1b1c1d' }} src="../static/images/knot/knotapi@0,1x.png" />
												<label style={{ color: 'white' }}>{t('login')}</label>
											</div>
										</Segment>
									</Header>
									<div className="card-body pb-0">
										<Segment>
											<form validate={validate} id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSignInSubmit}>
												<input name="_csrf" type="hidden" value={this.state.session.csrfToken} />

												<Form.Input
													fluid
													icon="at"
													iconPosition="left"
													placeholder={t('email_address')}
													id="email"
													name="email"
													type="email"
													className="form-control"
													value={this.state.email}
													onChange={this.handleEmailChange}
												/>
												<Button id="submitButton" type="submit" className="btn btn-outline-primary" style={{ backgroundColor: '#1b1c1d', color: 'white', margin: '14px 0' }} fluid size="large">
													{t('login_email')}
												</Button>
												<Button color="facebook" href="/auth/oauth/facebook">
													<Icon name="facebook" />
													{t('login_facebook')}
												</Button>
												<Button color="google plus" href="/auth/oauth/google">
													<Icon name="google" />
													{t('login_google')}
												</Button>
											</form>
										</Segment>

										<div className="row">
											<Segment color="black">
												{i18n.language === 'tr' ? (
													<div>
														Kaydolduğunda
														<br />
														<Link href="/terms">
															<a>Hizmet Şartları'nı </a>
														</Link>
														ve
														<Link href="/privacy">
															<a> Gizlilik Politikası'nı</a>
														</Link>
														<br />
														kabul etmiş olursun.
													</div>
												) : (
													<div>
														By signing up, you agree to our
														<br />
														<Link href="/terms">
															<a>Terms of Service </a>
														</Link>
														and
														<Link href="/privacy">
															<a> Privacy Policy.</a>
														</Link>
													</div>
												)}
											</Segment>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Grid.Column>
				</Grid>
			);
		}
	}
}

export class LinkAccounts extends React.Component {
	render() {
		const { t } = this.props;
		return (
			<div className="card mt-3 mb-3">
				<div className="card-body pb-0">
					<Segment>
						<Header as="h4">
							<Icon style={{ marginLeft: '1em' }} name="thumbs up" />
							<Header.Content >{t('accounts')}</Header.Content>
						</Header>
						<Grid className="container" textAlign="left" style={{ height: '100%' }} verticalAlign="middle">
							<Grid.Row>
								<Grid.Column>
									<LinkAccount provider="Facebook" session={this.props.session} linked={this.props.linkedAccounts.Facebook} {...this.props} />
									<LinkAccount provider="Google" session={this.props.session} linked={this.props.linkedAccounts.Google} {...this.props} />
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Segment>
				</div>
			</div>
		);
	}
}

export class LinkAccount extends React.Component {
	render() {
		const { t } = this.props;
		if (this.props.linked === true) {
			return (
				<form method="post" action={`/auth/oauth/${this.props.provider.toLowerCase()}/unlink`}>
					<input name="_csrf" type="hidden" value={this.props.session.csrfToken} />
					<Button color={this.props.provider.toLowerCase().replace(/google/, 'google plus')} type="submit" style={{ marginBottom: 5 }}>
						<Icon name={this.props.provider.toLowerCase()} />
						{t('unlink_account', { social: this.props.provider })}
					</Button>
				</form>
			);
		} else {
			return (
				<form>
					<Button color={this.props.provider.toLowerCase().replace(/google/, 'google plus')} href={`/auth/oauth/${this.props.provider.toLowerCase()}`} style={{ marginBottom: 5 }}>
						<Icon name={this.props.provider.toLowerCase()} />
						{t('link_account', { social: this.props.provider })}
					</Button>
				</form>
			);
		}
	}
}

export class SignInButtons extends React.Component {
	render() {
		return (
			<React.Fragment>
				{Object.keys(this.props.providers).map((provider, i) => {
					return (
						<p key={i}>
							<Button className="btn btn-block btn-outline-secondary" color="facebook" href={this.props.providers[provider].signin}>
								<Icon name="google plus" />
								Sign in with {provider}
							</Button>
						</p>
					);
				})}
			</React.Fragment>
		);
	}
}
export default withNamespaces()(Profile);
