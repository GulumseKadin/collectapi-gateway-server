const { getCollection, ObjectId } = require('./database');
const fs = require('fs');
const Users = getCollection('users');
const nodemailer = require('nodemailer');
const nodemailerTransport = nodemailer.createTransport({
	host: process.env.EMAIL_SERVER,
	port: process.env.EMAIL_PORT || 25,
	secure: false,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});
nodemailerTransport.verify(function(error, success) {
	if (error) {
		console.log(error);
	} else {
		console.log('Server is ready to take our messages');
	}
});
module.exports = {
	find: ({ id, email, emailToken, provider } = {}) => {
		let query = {};
		if (id) query = { _id: ObjectId(id) };
		else if (email) query = { email: email };
		else if (emailToken) query = { emailToken: emailToken };
		else if (provider) query = { [`${provider.name}.id`]: provider.id };
		return Users.findOne(query)
			.lean()
			.then(user => {
				if (user && user._id) user._id = user._id.toString();
				return user;
			});
	},
	// The user parameter contains a basic user object to be added to the DB.
	// The oAuthProfile parameter is passed when signing in via oAuth.
	//
	// The optional oAuthProfile parameter contains all properties associated
	// with the users account on the oAuth service they are signing in with.
	//
	// You can use this to capture profile.avatar, profile.location, etc.
	insert: (user, oAuthProfile) => {
		if (user && !user.created_at) user.created_at = new Date();
		let obj = new Users(user);
		return obj.save().then(it => {
			it = it.toObject();
			if (!user._id && it._id) user._id = it._id.toString();
			return user;
		});
	},
	// The user parameter contains a basic user object to be added to the DB.
	// The oAuthProfile parameter is passed when signing in via oAuth.
	//
	// The optional oAuthProfile parameter contains all properties associated
	// with the users account on the oAuth service they are signing in with.
	//
	// You can use this to capture profile.avatar, profile.location, etc.
	update: (user, profile) => {
		//user.profile = profile;
		return Users.updateOne({ _id: ObjectId(user._id) }, user)
			.lean()
			.then(_ => user);
	},
	// The remove parameter is passed the ID of a user account to delete.
	//
	// This method is not used in the current version of next-auth but will
	// be in a future release, to provide an endpoint for account deletion.
	remove: id => {
		return Users.deleteOne({ _id: ObjectId(id) }).lean();
	},
	// Seralize turns the value of the ID key from a User object
	serialize: user => {
		if (user._id) user._id = user._id.toString();
		if (user.id) return Promise.resolve(user.id);
		else if (user._id) return Promise.resolve(user._id.toString());
		else return Promise.reject(new Error('Unable to serialise user'));
	},
	// Deseralize turns a User ID into a normalized User object that is
	// exported to clients. It should not return private/sensitive fields,
	// only fields you want to expose via the user interface.
	deserialize: id => {
		return Users.findById(id)
			.lean()
			.then(user => {
				return {
					id: user._id.toString(),
					name: user.name,
					password: user.password,
					profile: !user.profile
						? {}
						: {
								name: user.profile.name,
								surname: user.profile.surname,
								phone: user.profile.phone,
								company: user.profile.company,
						  },
					emailToken: user.emailToken,
					email: user.email,
					emailVerified: !user.emailVerified,
					gwid: user.gwid,
					scopes: user.scopes || [],
					admin: user.admin || false,
					created_at: user.created_at,
				};
			})
			.catch(e => {
				console.warn(e);
				return Promise.resolve(null);
			});
	},
	// Define method for sending links for signing in over email.
	sendSignInEmail: ({ email = null, url = null } = {}) => {
		fs.readFile('./server/mail.html', { encoding: 'utf-8' }, (err, html) => {
			if (err) html = `<p>Use the link below to sign in:</p><p><a href="${url}" target="_blank">${url}</a></p>`;
			else {
				html = html.replace(/\{\{login_url\}\}/g, url);
			}
			nodemailerTransport.sendMail(
				{
					to: email,
					from: `CollectApi <${process.env.EMAIL_FROM}>`,
					subject: 'Sign in to CollectApi',
					text: `CollectApi\nApi Marketplace\nClick the link below to sign in to your CollectApi account.\nThis link will expire in 15 minutes and can only be used once.\n\n${url}\n\n`,
					html,
				},
				err => {
					if (err) {
						console.error('Error sending email to ' + email, err);
					}
				}
			);
		});
		if (process.env.NODE_ENV === 'development') {
			console.log('Generated sign in link ' + url + ' for ' + email);
		}
	},
};
