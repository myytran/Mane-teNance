//this folder contains all the ROUTES for the application
const Service = require('./models/services'); //importing services model from services.js
const bodyParser = require('body-parser');
const moment = require('moment');
const Scheduler = require('@ssense/sscheduler').Scheduler; //npm package for use with Moment.js to book schedule
const urlencodedParser = bodyParser.urlencoded({ extended: false })



module.exports = function(app, passport) {


    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs',{ message: req.flash('loginMessage')});
    });
//process the login form; uses strategy in passport.js to authenticate email and password
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/services', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exits
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/services', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

    // =====================================
    // BOOKING SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/services', isLoggedIn, function(req, res) {
        res.render('services.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

//app.get('/services', function(req,res){

    //  Service.find({},function(err,services){
      //  res.send(services);
      //});
  //  });

    // DELETE A SERVICE with supplied
    //app.delete('/services/:id', function (req, res) {
      //  Service.findByIdAndRemove({_id: req.params.id})
        //.then(Service => res.status(204).end())
      //  .catch(err => res.status(500).json({ message: 'Internal server error' }));
//});
//============================
//BOOKING AVAILIBILITY WITH MOMENT.JS
//======================
//this is for the schedule HOME PAGE w Post request from /services



app.get('/schedule/:time', function(req, res) {
  res.render('schedule.ejs', {output: req.params.time});
});


app.post('/schedule/time', function(req,res){
  var time = req.body.time;
    res.redirect('/schedule/' + time);
});





// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}; //closing tag for module.exports function

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
