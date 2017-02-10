var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Account = require('../models/account.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next){
	res.render('login', {title:'Login'});
});

// register
router.post('/register', function(req, res){
	var username = req.body.username,
		password = req.body.password;
	// check form value
	req.checkBody('username', 'Username can\'t be blank').notEmpty();
	req.checkBody('password', 'Invalid password')
		.notEmpty().withMessage('Password can\'t be blank')
		.len(8, 100).withMessage('Password must greater than 7 characters');

	req.getValidationResult().then(function(result){
		console.log(result.array());
	});
	// check if error occur
	var errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors: errors,
			username: username,
			password: password
		});
	} else{
		var account = new Account({
			username: username, 
			password:password
		});
		// add new account
		Account.createUser(account, function(err, account){
			if(err) throw errors;
			console.log(account);
			res.redirect('/');
		});
	}//else
});

//passport configure
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  Account.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done){
		Account.getByUserName(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknow user');
				return done(null, false, {message: 'Unknow username'});
			}

			Account.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else{
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}

			});
		});
	}
));

// login
router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res){
    console.log('Authentication Successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success','logout success');
	res.redirect('/users/login');
});

module.exports = router;
