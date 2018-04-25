//this folder contains all the ROUTES for the application
const Service = require('./models/services'); //importing services model from services.js
const bodyParser = require('body-parser');
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
            successRedirect : '/booking', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exi
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/booking', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

    // =====================================
    // BOOKING SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/booking', isLoggedIn, function(req, res) {
        res.render('newBooking.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.post('/service', urlencodedParser, function(req,res){
      //res.send(req.body);
      Service.create(req.body);
      res.send(200);
    });

    app.get('/services', function(req,res){
      Service.find({},function(err,services){
        res.send(services);
      });
    });
    // DELETE A SERVICE with supplied
    app.delete('/services/:id', (req, res) => {
      Service
        .findByIdAndRemove(req.params.id)
        .then(Service => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
    });




    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
