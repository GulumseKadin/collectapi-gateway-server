import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react';

const LoginForm = () => (
	<div className="login-form">
		{/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
		<style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 50%;
      }
    `}</style>
		<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
			<Grid.Column style={{ maxWidth: 450 }}>
				<Header as="h2" color="teal" textAlign="center">
					<Image src="../static/mstile-150x150.png" /> Log-in to your account
				</Header>
				<Form size="large">
					<Segment stacked>
						<Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address" />

						<Button color="teal" fluid size="large">
							Login
						</Button>
					</Segment>
				</Form>
				<Message>
					New to us? <a href="#">Sign Up</a>
				</Message>
				<Button color="facebook">
					<Icon name="facebook" /> Facebook ile Giriş Yap
				</Button>
				<Button color="google plus">
					<Icon name="google plus" /> Google ile Giriş Yap
				</Button>
			</Grid.Column>
		</Grid>

	</div>
);

LoginForm.getInitialProps = async () => ({ namespacesRequired: [] });

export default LoginForm;
