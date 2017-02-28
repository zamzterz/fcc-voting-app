'use strict';

const root = __dirname + '/views';
const PollHandler = require('./pollHandler.server.js');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app, passport) {
	const pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			if (req.user) {
				return res.sendFile('dashboard.html', {root: root});
			}
			res.sendFile('index.html', {root: root});
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile('/login.html', {root: root});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successReturnToOrRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/polls/:pollId')
		.get((req, res) => {
			pollHandler.getPollForId(req.params.pollId, (result) => {
				res.render('poll.pug', {
					user: req.user,
					pollIsMine: req.user ? req.user.github.id === result.creator.github.id : false
				});
			});
		})
		.post(urlencodedParser, pollHandler.addVote);

	app.route('/new-poll')
		.get(ensureLoggedIn('/login'), (req, res) => {
			res.sendFile('/new-poll.html', {root: root});
		})
		.post(urlencodedParser, pollHandler.createNewPoll);

	app.route('/api/polls')
		.get(pollHandler.getLatestPolls);
	app.route('/api/polls/:pollId')
		.get(pollHandler.getPollForRequestedId)
		.delete(pollHandler.deletePoll);
	app.route('/api/my-polls')
		.get(pollHandler.getPollsForAuthenticatedUser);

	app.route('/api/current-user')
		.get(function (req, res) {
			if (!req.user) {
				return res.status(401).end();
			}

			res.json(req.user.github);
		});
};
