import React from 'react';
import Error from 'next/error';

export default class Page extends React.Component {
	static async getInitialProps({ res, err }) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;
		return { statusCode };
	}

	render() {
		return (
			<div style={{ flex: 1, borderRadius: 6, overflow: 'hidden' }}>
				<Error statusCode={this.props.statusCode} />
			</div>
		);
	}
}
