export function isAdmin(props) {
	let user = props.session && props.session.user;
	return user && user.admin && user.admin === true;
}

export function AdminVisible(Component) {
	return props => {
		if (isAdmin(props)) return <Component {...props} />;
		return null;
	};
}
