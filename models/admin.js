var mongoose = require("mongoose");
 var groupSchema = new mongoose.Schema({

   name      : String
});

var adminSchema = new mongoose.Schema({
  name:{type:String,required:true,index:{unique:true}},
  password:{type:String,required:true},
  created_on:{type:Date,default:Date.now},
  groups:[groupSchema],
  company:{type:String}
});

var bcrypt = require("bcryptjs");
SALT_WORK_FACTOR=10;
adminSchema.pre("save",function(next){


  var user=this;
  if( !user.isModified("password"))return next();
bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){


  if(err)return next(err);

  bcrypt.hash(user.password,salt,function(err,hash){
    if(err)return next(err);

    user.password = hash;
    next();

  });

});

});


// Add compare method to schema
adminSchema.methods.comparePassword = function(candidatePassword, next) {
   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
       if (err) return cb(err);
       next(null, isMatch);
   });
}
mongoose.model("Admin",adminSchema);
mongoose.model("Groups",groupSchema);
