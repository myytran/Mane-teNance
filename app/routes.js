//this folder contains all the ROUTES for the application
const Service = require('./models/services'); //importing services model from services.js
const bodyParser = require('body-parser');
const moment = require('moment');
const Scheduler = require('@ssense/sscheduler').Scheduler; //npm package for use with Moment.js to book schedule
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Booking = require('./models/bookings.js');



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

//get all bookings and put on dashboard

app.get('/booking/:date/:time', isLoggedIn, function(req, res) {

  Booking.create({
    user_id: req.user._id,
    time: req.params.time,
    start: req.params.date
  },function(err,data){
    if(!err){
      res.render('confirmation.ejs',{booking:data});
    }
  })
});

app.get('/dashboard', function(req, res) {
Booking.find({
  user_id:req.user._id,
},function(err,data){
  if(!err){
      res.render('dashboard.ejs',{bookings:data} );
  }
})



});


app.post('/schedule/time', function(req,res){
  var time = req.body.time;
  Booking.find({},function(err,data){
    if(!err){
      var allocated = [];
      for (var i = 0; i < data.length; i++) {
        var booking = {from: moment(data[i].start).format(' YYYY-MM-DD HH:mm '), duration:parseInt(data[i].time)};
        allocated.push(booking);
      }

      const scheduler = new Scheduler();
      const availability = scheduler.getAvailability({
          from: moment().format('YYYY-MM-DD'),
          to: moment().add(30,'days').format('YYYY-MM-DD'),
          duration: time,
          interval: 30,
          schedule: {
              weekdays: {
                  from: '09:00', to: '17:00',
                  unavailability: [
                      { from: '12:00', to: '13:00' }
                  ]
              },
              allocated: allocated
          }
      });
      // res.send(availability);
      res.render('schedule.ejs',{availability:availability,time:time});
    }
    });

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
