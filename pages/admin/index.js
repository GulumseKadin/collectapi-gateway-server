import withAdminLayout from '../../components/AdminLayout';
import { withNamespaces } from '../../i18n';
import { Container, Dropdown, Grid, Header, Segment, Button } from 'semantic-ui-react';

function AdminIndex() {
	return <div>Admin Page</div>;
}

AdminIndex.getInitialProps = async () => {
	return { namespacesRequired: [] };
};

export default withNamespaces()(withAdminLayout(AdminIndex));
