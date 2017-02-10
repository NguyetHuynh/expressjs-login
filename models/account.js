var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var Account = new schema({
	username: {
		type: String,
		unique: true
	},
	password: String
});

var Account = module.exports = mongoose.model('Account', Account);

module.exports.getUserById = function(id, callback){
	Account.findById(id, callback);
}

module.exports.getByUserName = function(username, callback){
	var query = {username: username};
	Account.findOne(query, callback);
}

module.exports.comparePassword = function(repass, hash, callback){
	bcrypt.compare(repass, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

// create new user
module.exports.createUser = function(newAccount, callback){
	bcrypt.hash(newAccount.password, 10, function(err, hash){
		if(err) throw errors;
		newAccount.password = hash;
		newAccount.save(callback);
	});
}

