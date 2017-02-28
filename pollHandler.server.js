'use strict';

const Polls = require('./models/polls.js');
const Users = require('./models/users.js');
const ObjectID = require('mongodb').ObjectID;

function PollHandler () {

	this.getLatestPolls = (req, res) => {
		Polls
			.find({})
			.populate('creator answers.creator').sort('-date')
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result);
			});
	};

	this.getPollsForAuthenticatedUser = (req, res) => {
		if (!req.user) {
			return res.status(401).end();
		}

		Users.findOne({'github.id': req.user.github.id}, (err, result) => {
			Polls
				.find({'creator': result._id})
				.populate('creator answers.creator').sort('-date')
				.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result);
				});
		});
	};

	this.getPollForRequestedId = (req, res) => {
		this.getPollForId(req.params.pollId, (result) => {res.json(result)})
	}

	this.getPollForId = (pollId, callback) => {
		Polls
			.findOne({'_id': pollId})
			.populate('creator answers.creator').sort('-date')
			.exec(function (err, result) {
				if (err) {
					return res.status(404).end();
				}

				callback(result);
			});
	}

	this.deletePoll = (req, res) => {
		Users.findOne({'github.id': req.user.github.id}, (err, result) => {
			Polls.findOneAndRemove({'_id': req.params.pollId, creator: result._id}, (err, result) =>{
				if (err) {throw err};

				res.end();
			});
		});
	}

	this.createNewPoll = (req, res) => {
		if (!req.user) {
			return res.status(401).end();
		}
		Users.findOne({'github.id': req.user.github.id}, (err, result) => {
			let creator = result._id;
			let answers = null;
			if (req.body.answer instanceof Array) {
				answers = req.body.answer;
			} else {
				answers = [req.body.answer];
			}

			let poll = {
				question: req.body.question,
				creator: creator,
				answers: answers.map((ans) => {return {answer: ans, creator: creator, frequency: 0}})
			}

			Polls.create(poll);
			res.redirect('/');
		});
	}

	this.addVote = (req, res) => {
		if (ObjectID.isValid(req.body.answer)) {
			// vote for existing answer
			Polls.findOneAndUpdate(
				{'_id': req.params.pollId, 'answers._id': req.body.answer},
				{$inc: {'answers.$.frequency': 1}},
				function(err, result) {
					if (err) {throw err;}

					res.end();
				}
			);
		} else {
			if (!req.user) {
				res.status(401).end();
			}

			// new answer
			Users.findOne({'github.id': req.user.github.id}, (err, result) => {
				let data = {
					creator: result._id,
					answer: req.body.answer,
					frequency: 1
				}

				Polls.findByIdAndUpdate(
	        req.params.pollId,
	        {$push: {'answers': data}},
	        function(err, result) {
						if (err) {throw err;}
						res.end();
	        }
	    	);
			});
		}
	};
}

module.exports = PollHandler;
