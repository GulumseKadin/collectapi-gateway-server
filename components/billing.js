import React, { Component } from 'react';
import { rest } from '../lib/rest';

const form_info = ['name', 'surname', 'identityNumber', 'city', 'country', 'email', 'gsmNumber', 'registrationAddress', 'zipCode', 'contactName'];

export default class Billing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			form: {},
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		fetch('/rest/user/data/billing')
			.then(it => it.json())
			.then(data => this.setState({ form: data.data || {}, loading: false }));
	}

	onSubmit() {
		rest('/rest/user/data/billing', this.state.form);
	}

	onChange(e) {
		this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value,
			},
		});
	}

	render() {
		if (this.state.loading) return <div>loading...</div>;
		return (
			<div>
				<input value={this.state.form.city} onChange={this.onChange} name="city" placeholder="City" />
				<input value={this.state.form.add} onChange={this.onChange} name="add" placeholder="add" />
				<button onClick={this.onSubmit}>save</button>

				<pre>{JSON.stringify(this.state, null, 2)}</pre>
			</div>
		);
	}
}
