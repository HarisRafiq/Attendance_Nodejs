var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var helper = require("../utils");


//create new user
function createNewUser(req,res,next){
  var username = req.body.username;
  var pwd = req.body.password;
  var admin_id=req.body.admin_id;
  var department = req.body.dept_id;

   User.create({

     name:username,
     password:pwd,
     department:department,
     dutyHours:0,
     admin:admin_id
  },function(err,user){
    if(user){
      req.session.regenerate(function() {
          req.session.user = user;
          req.session.success = "Authenticated as " + user.name;
          res.redirect(301,'/dashboard');


      });
    }
    else {
      console.log("Error creating new user: " + err);
res.jsonp({msg:"Error Creating New User. Try Again Later",status:-1});
    }
  });
}


//Updates a user
function updateUser(req,res,next){
  var username = req.session.username;
  var pwd= req.body.password;
  var newPwd=req.body.newPassword;
  if(pwd||newPwd&&pwd!=newPwd){
    req.session.error = "Passwords do not match";
    res.status=404;
  res.jsonp({"err":"Passwords Dont Match"});
  }
  else{
    User.findOne({name:username},function(err,user){
      if(err){
        req.session.error = "Error updating using";
        res.status=404;
        res.jsonp({"err":"Session Ended"});

      }
      else{
        user.save(user,function(err,userId){
if(err){
console.log("Error updating user: " + err);
                       req.session.error = "A problem occured updating the user.";
                       res.status=404;
                         res.jsonp({"err":"Failed to update"});

}
else {
console.log("Update "+user);
req.session.regenerate(function(){
  console.log("Updated Successfully");
  req.session.success="Updated Successfully";
  res.status=200;
    res.jsonp(user);

});
      }

    });

  }
});
}
}


//Deletes a user
function deleteUser(req,res,next){
  var username = req.body.user.name;
  User.findOne({name:username},function(err,user){
    if(err)helper.returnError(res);
    else{
      user.remove(function(err,userRemoved){
        if(err)helper.returnError(res);
        else {
        res.status=200;
        res.jsonp("msg:Successfully");
      }
      });
    }

  });
}


//find all users
function fetchAllUsers(req,res){

var query = User.find(true);
var s={};
s["name"]=1;
s["created_on"]=1;
s["department"]=1;
s["access_level"]=1;


console.log(s);
query.select(s);
query.lean();
query.exec(function(err,dataset){

res.render("users", {datasets: dataset});
});


}

//function finds all attendance of a user in a range
function findAttendance(req,res){
  var username =req.session.user.name;
  User.findOne({name:username},function(err,user){
    if(err){console.log("Error retrieving user " + err); return res.jsonp({'msg':"Data not found",'status':0});}
    else {

console.log("User" + user);
if(user.attendance)
        return res.jsonp({'msg':user.attendance,'status':1});
else return res.jsonp({'msg':'Data not found','status':0});
    }
  });


}


//function:updates users todays attendance
function insertTodaysAttendance(req,res)
  {
    var username =req.session.user.name;
    var month = helper.getCurrentYear();

    var month = helper.getCurrentMonth();
    var day = helper.getCurrentDay();
    console.log(month);
    User.findOne({name:username},function(err,user){
      if(err)
      {
        //res.status=500;
        res.jsonp({"error":"Internal Error"});

      }
      else if (user) {


var query = {};
  query['attendance.'+month+'.'+day+'.OT'] = 0;//OT hours

  user.update(
   {
     $set: query



 },{safe: true, upsert: true},function (err,datasetID)
 {
     if(err){
     //  res.status=500;
     res.jsonp({'err':err,'status':-1});

console.log("error");
console.log(err);
     }
     else if (datasetID) {
         //res.status=200;
           res.jsonp({'msg':datasetID,'status':1});

     }

 }

);
}
});
}


  //function:updates users attendance
  function insertAttendance(req,res)
    {
      var username =req.session.user.name;
      var month = req.params.month;

      var day = req.params.day;

      var remarks = req.params.remarks;
      if(!remarks)remarks='Enter Remarks';
      var ot = req.params.ot;
if(!ot)ot=0;
      console.log(month);
      User.findOne({name:username},function(err,user){
        if(err)
        {
          //res.status=500;
          res.jsonp({'err':err,'status':-1});
         }
        else if (user) {


  var query = {};
    query['attendance.'+month+'.'+day+'.OT'] = ot;
   query['attendance.'+month+'.'+day+'.remarks'] = remarks;
   user.replaceOne(
         query,
         query
      ,{safe: true, upsert: true},function (err,datasetID)
          {
              if(err){
              //  res.status=500;
              res.jsonp({'err':err,'status':-1});

   console.log("error");
  console.log(err);
              }
              else if (datasetID) {
                  //res.status=200;
                    res.jsonp({'msg':datasetID,'status':1});

              }

          }

        );
        }
      });
     }


//Fetch One month Attendance
function fetchOneMonthData(req,res){
  var username =req.session.user.name;
console.log(username);
 var month = req.params.month;
var query = User.find({name:username});
var s={};
s["attendance."+month]=1;
s["dutyHours"]=1;


query.select(s);
query.lean();
query.exec(function(err,dataset){

if(!err)
        return res.jsonp({'msg':dataset,'status':1});
else return res.jsonp({'msg':'Data not found','status':0});
});


}
//Fetch One month Group Attendance
function fetchOneMonthGroupData(req,res){
  var groupid =req.params.groupid;
  var month = req.params.month;
var query = User.find({department:groupid});
var s={};
s["attendance."+month]=1;
s["dutyHours"]=1;
s["name"]=1;
s["status"]=1;


query.select(s);
query.lean();
query.exec(function(err,dataset){

if(!err)
        return res.jsonp({dataset,'status':1});
else return res.jsonp({'msg':'Data not found','status':0});
});


}


//function find register
router.post('/register',createNewUser);
router.get('/dashboard', function(req, res, next) {
res.render("attendance");
});
router.post('/edit',helper.authenticate,updateUser);
router.post('/delete',deleteUser);
 router.get('/insertAttendance/:month/:day/:remarks/:ot',insertAttendance);
router.get('/myAttendance/:month',fetchOneMonthData);
router.get('/groupTest/:groupid/:month',fetchOneMonthGroupData);
router.get('/todayAttendance',insertTodaysAttendance);

router.get('/allUsers',fetchAllUsers);


/* GET users listing. */
module.exports = router;
