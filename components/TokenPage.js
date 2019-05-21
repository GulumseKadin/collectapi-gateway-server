import React, { Component } from 'react';
import { Button, Grid, Icon, Form, Tab, Loader, Label, Header, Message, Segment } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withNamespaces } from '../i18n';
import _ from 'lodash';

class UserTabs extends Component {
	constructor(props) {
		super(props);
		let user = props.session.user;
		this.state = {
			showMe: false,
			token: user.emailToken,
			copied: false,
			gwtoken: user.token,
			loading: user.token || true,
		};
	}

	componentDidMount() {
		this.mounted = true;
		if (!this.state.gwtoken)
			fetch('/rest/user/token')
				.then(it => it.json())
				.then(data => {
					if (!this.mounted) return;
					this.setState({ gwtoken: data.gwtoken, loading: false, scopes: data.scopes || [] });
				})
				.catch(e => {
					if (!this.mounted) return;
					this.setState({ gwtoken: null, loading: false });
				});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	operation = () => {
		this.setState({
			showMe: !this.state.showMe,
		});
	};

	render() {
		const { t } = this.props;
		if (this.state.loading)
			return (
				<Tab.Pane attached={false}>
					<Loader active inline="centered" />
				</Tab.Pane>
			);
		return (
			<Tab.Pane attached={false}>
				<Header as="h4">
					<Icon name="key" />
					<Header.Content>{t('your_api_token')}</Header.Content>
				</Header>

				<Form>
					<Form.Input value={this.state.showMe ? this.state.gwtoken : this.state.gwtoken.replace(/./g, '*')} onChange={({ target: { value } }) => this.setState({ value, copied: false })} action>
						<input readOnly />
						<Button content={this.state.showMe ? t('hide') : t('show')} primary onClick={this.operation} />
						<CopyToClipboard text={this.state.gwtoken} onCopy={() => this.setState({ copied: true })}>
							<Button icon color={this.state.copied ? 'teal' : undefined}>
								<Icon name={this.state.copied ? 'check' : 'copy'} />
								{t('copy')}
							</Button>
						</CopyToClipboard>
					</Form.Input>
				</Form>
				{this.state.scopes && !this.state.scopes.length ? (
					<Message warning>
						<Message.Header>{t('subscriptions_error')}</Message.Header>
						{t('info_princing')}{' '}
						<a href="/pricing" target="_top">
								{t('goto_pricing')}
							</a>
					</Message>
				) : (
					
					<Message>
						<Message.Header>{_.intersection(this.state.scopes,'premium')?('Premium'):('Basic')} paketine sahipsiniz.</Message.Header>
						<Message.Content>Bu paket içindeki Apileri kullanabilirsiniz.</Message.Content>
					</Message>
				)}
			</Tab.Pane>
		);
	}
}

export default withNamespaces()(UserTabs);
