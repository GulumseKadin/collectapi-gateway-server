const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const freeSchema = new Schema({}, { strict: false });

const db = mongoose.createConnection(`mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}/${process.env.MONGO_DB || 'apimapi'}`, { useNewUrlParser: true });

const collections = {};

/**
 *
 * @returns {mongoose.Model}
 */
const getCollection = collection => {
	if (collections[collection]) return collections[collection];
	return (collections[collection] = db.model(collection, freeSchema, collection));
};

/**
 *
 * @returns {mongoose.mongo.ObjectId}
 */
const ObjectId = id => {
	return id ? new mongoose.mongo.ObjectId(id) : new mongoose.mongo.ObjectId();
};

module.exports = {
	db,
	getCollection,
	ObjectId,
};
