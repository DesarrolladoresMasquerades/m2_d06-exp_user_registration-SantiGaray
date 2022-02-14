const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRounds = 5;
const bcrypt = require('bcrypt');
const res = require('express/lib/response');

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
		if(user && user.username) {
			res.render("signup", {errorMessage: "User already taken!"});
		throw new Error("Validation Error 1") // BEST WAY!!!!
		console.log("Exist: ",user) }
		
		//else{
		const salt = bcrypt.genSaltSync(saltRounds) // we bring bcrypt and we are telling it to create randomly the hashedPwd
		const hashedPwd = bcrypt.hashSync(password, salt)

		User.create({ username, password: hashedPwd })
		.then((newUser) => {
			console.log("New User: ", newUser)
			res.redirect("/")
		})//}
	

	});
});

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.render("login", { errorMessage: "All filds are required" });
      throw new Error("Validation error");
    }

    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render("login", { errorMessage: "Incorrect credentials!" });
          throw new Error("Validation error");
        }

        const isPwCorrect = bcrypt.compareSync(password, user.password);
        if (isPwCorrect) {
          req.session.currentUserId = user._id
          res.redirect("/auth/profile");
          //res.render("login", { errorMessage: "You are correctly logged in!" })
        } else {
          res.render("login", { errorMessage: "Incorrect credentials!" });
        }
      })
      .catch((error) => console.log(error));
  });

router.get('/profile', (req, res) => {
  const id = req.session.currentUserId;
  User.findById(id)
  .then((user) => res.render("profile", user))
  .catch(err=>console.log(err));
});

router.get("/logout", (req, res) => {
  req.session.destroy((err)=>res.redirect("/")
  )
})

module.exports = router;
