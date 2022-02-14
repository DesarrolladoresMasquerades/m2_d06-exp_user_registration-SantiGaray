const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRounds = 5;
const bcrypt = require('bcrypt');

router.route('/signup')
.get( (req, res) => {
	res.render('signup');
})
.post((req, res) => {;
	const username = req.body.username;
	const password = req.body.password;
	
	// Check the form is NOT empty
	if(!username || !password) { 
		res.render("signup", {errorMessage: "All fields are required"})
		// return // this if is a killswitch, it tells me that the body will execute if this if is passed. by body means what is next.(User.find, User.create)
	}
	User.findOne({username})
	.then((user) =>{
		if(user && user.username) {res.render("signup", {errorMessage: "User already taken!"}) 
		console.log("Exist: ",user) }
		
		else{
		const salt = bcrypt.genSaltSync(saltRounds) // we bring bcrypt and we are telling it to create randomly the hashedPwd
		const hashedPwd = bcrypt.hashSync(password, salt)

		User.create({ username, password: hashedPwd })
		.then((newUser) => {
			console.log("New User: ", newUser)
			res.redirect("/")
		})}
	

	});
});

router.get('/login', (req, res, next) => {
	res.render('login');
});

router.get('/profile', (req, res) => {
	res.render('profile');
});

module.exports = router;
