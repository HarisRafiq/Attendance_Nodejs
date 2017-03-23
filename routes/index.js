var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Admin = mongoose.model("Admin");




function login(req,res,next){


    var username = req.body.username;
    var password = req.body.password;
    // Find user document by username
    // If a user is returned but the passwords do not match, send error message indicating wrong password
    // If no user is returned, send error message indicating wrong username
    Admin.findOne({name:username}, function(err, user) {
            if (err) {
                console.log("Error retrieving user " + err);
                res.status=401;
                  res.jsonp({msg:"Error finding user",status:-1});
            } else if (user) {
                // Use the method registered on the User model to compare entered password with user password
                user.comparePassword(password, function(err, isMatch) {
                    if (err) throw err;

                    if (isMatch) {
                        req.session.regenerate(function() {
                            req.session.user = user;
                            req.session.access_level=1;
                            req.session.success = "Authenticated as " + req.session.user.id;
                            req.session.save(function(err) {
  // session saved
   res.redirect(301,'/admin/dashboard');
});

                              console.log(req.session.user);

                        });
                    } else {
                        req.session.error = "Authentication failed, please check your password.";
                        res.status=401;
                        console.log("Check Your Password");

                          res.jsonp({msg:"Check Your Password",status:-1});

                    }
                });
            } else {
              // If a user is returned but the passwords do not match, send error message indicating wrong password
              // If no user is returned, send error message indicating wrong username
              User.findOne({name:username}, function(err, user) {
                      if (err) {
                          console.log("Error retrieving user " + err);
                          res.status=401;
                          res.jsonp({msg:"Error finding user",status:-1});
                      } else if (user) {
                          // Use the method registered on the User model to compare entered password with user password
                          user.comparePassword(password, function(err, isMatch) {
                              if (err) throw err;

                              if (isMatch) {
                                  req.session.regenerate(function() {
                                      req.session.user = user;
                                      req.session.success = "Authenticated as " + user.name;
                                      req.session.access_level=2;
                                      res.redirect(301,'/users/dashboard')

                                      console.log(req.session.user);

                                  });
                              } else {
                                  req.session.error = "Authentication failed, please check your password.";
                                  res.status=401;
                                  console.log("Check Your Password");

                                    res.jsonp({msg:"Check Your Password",status:-1});

                              }
                          });
                      } else {
                          req.session.error = "Authentication failed, please check your username.";
                          res.status=401;
                          console.log("Check Your USER");

                            res.jsonp({msg:"Check Your Username",status:-1});
                      }
              });
            }
    });


 }

 // index endpoint
 router.get('/', function (req,res,next) {
   if(!req.session.user)
   {
res.redirect(301,'/loginA');
return;
}


     if(req.session.access_level===1){
     res.redirect(301,'/admin/dashboard');}
     if(req.session.access_level===2){
     res.redirect(301,'/users/dashboard')}



 });
 // Logout endpoint
 router.get('/logout', function (req, res,next) {


   req.session.destroy(function (err) {
  if (err) res.send("Error");
req.session=null;
  res.redirect('/loginA');
});
 });

router.post('/login',login);
router.get('/loginC', function(req, res, next) {
res.render("loginC");
});

router.get('/registerA', function(req, res, next) {
res.render("registerA");
});
router.get('/loginA', function(req, res, next) {
res.render("loginA");
});
router.get('/group', function(req, res, next) {
res.render("manager/group");
});
//serve registeration page after capturing admin_id
function registerationRequest(req,res,next){
  var admin_id=req.params.admin;
  var department_id=req.params.dept;


  res.render("registerC",{'admin_id':admin_id,'dept_id':department_id});

}
router.get('/register/:admin/:dept/', registerationRequest);

module.exports = router;
