var express = require('express');
var router = express.Router();
var mysql = require('mysql')

//This is used to encrypt user's passwords
var bcrypt = require('bcryptjs');

var path = require('path');
var salt = bcrypt.genSaltSync(10);

//Creates a connectionPool that will allow mulitple connection to occur at the same time
var connection = mysql.createPool({
	host: 'us-cdbr-iron-east-04.cleardb.net',
	user: 'bf23a0d88f3f72',
	password: 'b078956a',
	database: 'heroku_29cbaaca721eebf'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req,res,next) {
	res.render('login');
});

/* GET signup page. */
router.get('/signup', function(req,res,next) {
	res.render('signup');
});

/* Registers users into the database. */
router.get('/registerUser', function(req,res,next) {
	var message = "";
	message = req.query.pass;
	var post;
	//this will hash the password so when it is stored in the DB it will be unregonizable.
	var hash = bcrypt.hashSync(message, salt);
	post = {userName: req.query.userName, emailAddress: req.query.emailAcc, password: hash};
	function addUser(data, callback) {
		//connects to the database
		connection.getConnection(function(err, conn) {
			
			if(!err) {
				//Inserts the user's information into the database
				conn.query('INSERT INTO users SET ?', post, function(err, result) {
					try{
						if(err) {
							throw err;
						} else {
							//If the insert was successful
							callback(null, "Success");
						}
					} catch (e) {
						//If the insert was a failure
						callback("ERROR", null)
					}
				});
			} else {
				console.log("Nope");
			}
		});
	}

	//Calls the database query and passes in the info and when the function gets a callback will
	//send conformation to the front-end letting the user now the registration was a success or failure
	addUser(post, function(err, content) {
		if(err) {
			res.send(err);
		} else {
			res.send(post);
		}
	});
});

/* GET application page. */
router.get('/application', function(req, res, next) {
	res.render("application");
});

/* Saves the location into the database. */
router.post('/saveLocation', function(req,res,next) {
	console.log(req.body.lat + " "+ req.body.lng+ " "+ req.body.email);
	var post = {emailAddress: req.body.email, latitude: req.body.lat, longitude: req.body.lng}
	
	//Creates a connection to the database
	connection.getConnection(function(err, conn) {
		if(!err) {
			//Inserts the email address along with the longitude and latitude into the database, the primary key is auto generated.
			conn.query('INSERT INTO savedlocation SET ?', post, function(err, result) {
				try{
					if(err) {
						throw err;
					} else {
						//If the save was successful.
						res.send("SUCCESS");
					}
				} catch(e) {
					//If the save was a failure.
					res.send(e);
				}
			});
		} else {
			res.send("FAILURE");
		}
	});
});

//Obtains all the locations the user has saved.
router.get('/getLocations', function(req, res, next) {
	console.log(req.query.email);

	//Creates a connection to the database
	connection.getConnection(function(err, conn) {
		if(!err) {
			//Obtains the locations saved based of the user's email address.
			conn.query("SELECT * FROM savedlocation WHERE emailAddress ='"+ req.query.email+"'", function(err, rows) {
				try{
					if(err) {
						throw err;
					} else {
						res.send(rows);
					}
				} catch(e) {
					res.send("ERROR");
				}
			});
		} else {
			res.send("ERROR");
		}
	});
});

//Whne user is login in checks to see if all the credentials are met, before redirecting them to the application page.
router.get('/loginUser', function(req,res,next) {
	var post = {emailAddress: req.query.emailAcc, password: req.query.pass};
	
	function loginUser(data, callback) {
		connection.getConnection(function(err, conn){
			if(!err) {
				//Grabs the login information based off the email address entered.
				conn.query("SELECT * FROM users WHERE emailAddress ='" +data.emailAddress+"'", function(err, rows){
				try{
						if(err) {
							throw err;
						} else {
							//Returns the rows that have the email address in it (should only be one row because email address is the primary key in this table).
							callback(null, rows);
						}
					} catch (e) {
						callback("ERROR", null)
					}
				});
			} else {
				console.log("AN unexprected error occurred in the databse");
			}
		});
	}

	//Calls the function that will obtain the row of the email address
	loginUser(post, function(err, content) {
		if(err) {
			res.end(err);
		} else {
			//This will check if the email address the user entered exists in the database.
			if(content[0] == null) {
				res.send("ERROR");
			} else {
				//Compare the password they entered to the password stored in the database.
				bcrypt.compare(post.password, content[0].password, function(err, ser) {
					//If ser is true that means the passwords match and the login was successful
					if(ser) {
						try {
							var info = {userName: content[0].userName, emailAddress: content[0].emailAddress, pass: content[0].password};
							res.send(info);
						} catch (e) {
							console.log(e);
						}
						//The passwords did not match and return INVALID to the user.
					} else {
						res.send("INVALID");
					}
				});
			}
		}
	});
});

module.exports = router;
