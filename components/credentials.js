import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { NextAuth } from 'next-auth/client'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon, Card } from 'semantic-ui-react';

export default class extends React.Component {
  
  static async getInitialProps({req}) {
    return {
      session: await NextAuth.init({req}),
      linkedAccounts: await NextAuth.linked({req}),
      providers: await NextAuth.providers({req})
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      session: this.props.session
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSignInSubmit = this.handleSignInSubmit.bind(this)
  }

  async componentDidMount() {
    if (this.props.session.user) {
      Router.push(`/auth/`)
    }
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }
  
  handleSignInSubmit(event) {
    event.preventDefault()

    // An object passed NextAuth.signin will be passed to your signin() function
    NextAuth.signin({
      email: this.state.email,
      password: this.state.password
    })
    .then(authenticated => {
      Router.push(`/auth/callback`)
    })
    .catch(() => {
      alert("Authentication failed.")
    })
  }
  
  render() {
    if (this.props.session.user) {
      return null
    } else {
      return (
				<Grid className="container" textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 450 }}>
						<div className="row">
							<div className="col-sm-6 mr-auto ml-auto">
								<div className="card mt-3 mb-3">
									<Header as="h2" color="black" textAlign="center">
										<br />
										<Segment stacked>
											<div style={{ background: '#1b1c1d' }}>
												<Image style={{ margin: 'auto', background: '#1b1c1d' }} src="../static/images/knot/knotapi@0,1x.png" />
											</div>
											<div style={{ background: '#1b1c1d' }}>
												<label style={{ color: 'white' }}>Giriş Ekranı</label>{' '}
											</div>
										</Segment>
									</Header>
									<div className="card-body pb-0">
										<Segment stacked>
											<form id="signin" method="post" action="/auth/email/signin" onSubmit={this.handleSignInSubmit}>
												<input name="_csrf" type="hidden" value={this.state.session.csrfToken} />
												<p>
													<Form.Input fluid icon="at" iconPosition="left" placeholder="E-mail Adres" id="email" className="form-control-mail" value={this.state.email} onChange={this.handleEmailChange} />
                          <Form.Input fluid icon="key" iconPosition="left" placeholder="Şifre" id="password" className="form-control-password" value={this.state.password} onChange={this.handlePasswordChange} />
												    
                        </p>
												<p className="text-right">
													<Button id="submitButton" type="submit" className="btn btn-outline-primary" style={{ backgroundColor: '#1b1c1d', color: 'white' }} fluid size="large">
														E-mail ile giriş yap
													</Button>
												</p>
												<Button color="facebook" href="/auth/oauth/facebook">
													<Icon name="facebook" />
													Facebook ile Giriş Yap
												</Button>
												<Button color="google plus" href="auth/oauth/google">
													<Icon name="google" />
													Google ile Giriş Yap
												</Button>
											</form>
										</Segment>
									</div>
								</div>
							</div>
						</div>
					</Grid.Column>
				</Grid>
      )
    }
  }
}