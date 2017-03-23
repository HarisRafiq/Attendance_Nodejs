var momentjs = require("moment");

var moment = momentjs().utc();
console.log(moment.format());
console.log(moment.hour());
console.log(moment.day());

function authenticate(req,res,next){

  if(req.session.user)
    next();
  else {
    req.session.error = "Error Authenticating User";
    res.redirect('/');
  }

}
exports.authenticate = authenticate;

function returnError(res){
  res.status=403;
  res.jsonp("err:error");
}
exports.returnError = returnError;
function getCurrentDay(){

return moment.date();

}
exports.getCurrentDay = getCurrentDay;

function getCurrentHour(){

return moment.hour();

}
exports.getCurrentHour = getCurrentHour;

function getCurrentMonth(){

  return moment.month();
}
exports.getCurrentMonth = getCurrentMonth;

function getCurrentYear(){

  return moment.year();
}
exports.getCurrentYear = getCurrentYear;
