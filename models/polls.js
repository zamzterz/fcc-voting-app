'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Answer = new Schema({
	answer: String,
	frequency: Number,
	creator: {type: Schema.Types.ObjectId, ref: 'User'}
});


var Poll = new Schema({
	question: String,
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	answers: [Answer]
});

module.exports = mongoose.model('Poll', Poll);
