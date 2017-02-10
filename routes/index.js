var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureLogin, function(req, res, next) {
  res.render('index', { title: 'Login App'});
});

// user logged in?
// not --> redirect login page
function ensureLogin(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
