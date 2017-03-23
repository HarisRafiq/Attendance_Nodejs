var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");

var Admin = mongoose.model("Admin");

var helper = require("../utils");
var async = require('async');


//create new user
function createNewUser(req,res,next){
 var user = req.body.username;
 var pwd = req.body.password;
 var company = req.body.company;


 Admin.create({

   name:user,
   password:pwd,

   company:company

 },function(err,user){
   if(user){
    return res.redirect(301,'/loginA');

 }
   if(err){
     console.log("Error creating new user: " + err);
res.jsonp({msg:"Error Creating New User. Try Again Later",status:-1});
   }
 });
}


//Updates a user
function updateUser(req,res,next){
 var username = req.session.user.name;
 var pwd= req.body.password;
 var newPwd=req.body.newPassword;
 if(pwd||newPwd&&pwd!=newPwd){
   req.session.error = "Passwords do not match";
   res.status=404;
 res.jsonp({"err":"Passwords Dont Match"});
 }
 else{
   Admin.findOne({name:username},function(err,user){
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
function deleteAdmin(req,res,next){
 var username = req.body.username;
 Admin.findOne({name:username},function(err,user){
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

//Create group
function createGroup(req,res,next){
  console.log("Creating Group");

  var groupName = req.body.groupName;
  var username=req.session.user.name;

      Admin.findOne({name:username},function(err,user){
        if(err)
        {
          //res.status=500;
          res.jsonp({'err':err,'status':-1});
         }
        else if (user) {

          console.log("Creating Group..");
          user.groups.push({name:groupName});
          var subdoc = user.groups[0];
          console.log(subdoc) // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }

  user.save(function (err) {
  if (err){   //  res.status=500;
    res.jsonp({'err':err,'status':-1});}
    else res.jsonp({'msg':'success','status':1});

  });

        }
      });

}

//Deletes a group
function removeGroup(req,res,next){
  var admin_id=req.session.user._id;
 Admin.findById(admin_id,function(err,user){
   if(err)helper.returnError(res);
   else{
     console.log(req.body.group_id);

     user.groups.id(req.body.group_id).remove();
      user.save(user,function(err,userId){
if(err){
console.log("Error updating user: " + err);
                     req.session.error = "A problem occured updating the user.";
                     res.status=404;
                       res.jsonp({"err":"Failed to update"});

}
else {

res.status=200;
  res.jsonp(user);

}

});
}
});
}
function adminDashboard(req,res,next){
  
var admin_id=req.session.user._id;
var groups={};
var users={};
async.parallel([
    function(callback) { //This is the first task, and `callback` is its callback task
      var query2 = Admin.findById(admin_id);


      query2.populate('groups');

       query2.exec(function(err2,dataset2){
            //Now we have saved to the DB, so let's tell Async that this task is done
            groups=dataset2;
callback();
          });
    },
    function(callback) { //This is the second task, and `callback` is its callback task
      var query = User.find({admin:req.session.user});

query.lean();
      query.exec(function(err,dataset){
            //Now we have saved to the DB, so let's tell Async that this task is done
            users=dataset;

callback();
         });  }
], function(err) { //This is the final callback
  console.log(users);
  users.forEach(function(user) {
    groups.groups.forEach(function(group){

       if(String(user.department) === String(group._id)){ user.department=group.name;
}

    });
  });

  res.render("users",{'user':req.session.user.name,'groups':groups,'users':users});
});


    }

    //find all users
    function redirectToGroup(req,res){


    res.render("manager/group");



    }
    //function:updates users attendance
    function insertAttendance(req,res)
      {
        var username =req.session.user.name;
        var month = req.params.month;
var userid=req.params.userid;
        var day = req.params.day;

        var remarks = req.params.remarks;
        if(!remarks)remarks=' ';
        var ot = req.params.ot;
    if(!ot)ot=0;
        console.log(month);
        User.findOne({_id:userid},function(err,user){
          if(err)
          {
            //res.status=500;
            res.jsonp({'err':err,'status':-1});
           }
          else if (user) {


    var query = {};
      query['attendance.'+month+'.'+day+'.OT'] = ot;//OT hours
     query['attendance.'+month+'.'+day+'.remarks'] = remarks;//OT hours

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
//fucntion delete attendance
//function:updates users attendance
function removeAttendance(req,res)
  {
     var month = req.params.month;
var userid=req.params.userid;
    var day = req.params.day;


    User.findOne({_id:userid},function(err,user){
      if(err)
      {
        //res.status=500;
        res.jsonp({'err':err,'status':-1});
       }
      else if (user) {


var query = {};
query['attendance.'+month+'.'+day] = ' ';//OT hours

         user.update(
          {
            $unset: query



        },function (err,datasetID)
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

   //function:updates user
   function updateUser(req,res)
     {
        var dutyHours = req.params.inputDutyHours;
 var userid=req.params.userid;
 var status=req.params.status;


       User.findOne({_id:userid},function(err,user){
         if(err)
         {
           //res.status=500;
           res.jsonp({'err':err,'status':-1});
          }
         else if (user) {


   var query = {};
     query['dutyHours'] = dutyHours;//OT hours
     query['status'] = status;//0-Reg 1-Manager

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

      //Deletes a user
      function deleteUser(req,res,next){
        var userid= req.params.id;
        User.findOne({_id:userid},function(err,user){
          if(err)helper.returnError(res);
          else{
            user.remove(function(err,userRemoved){
              if(err)helper.returnError(res);
              else {
              res.status=200;
              res.jsonp({'msg':'Successfully Deleted','status':1});
            }
            });
          }

        });
      }
//function find register
router.post('/register',createNewUser);
router.get('/dashboard',adminDashboard);
router.post('/addGroup',createGroup);
router.post('/removeGroup',removeGroup);
router.get('/group/:id',redirectToGroup);
router.post('/edit',helper.authenticate,updateUser);
router.post('/delete',deleteAdmin);
 router.get('/insertAttendance/:userid/:month/:day/:remarks/:ot',insertAttendance);
router.get('/removeAttendance/:userid/:month/:day',removeAttendance);
router.get('/updateUser/:userid/:inputDutyHours/:status',updateUser);
router.get('/deleteUser/:id',deleteUser);

module.exports = router;
