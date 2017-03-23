// Ion.Calendar
// version 2.0.2, build: 92
// © 2013 Denis Ineshin | IonDen.com
//
// Project page:    http://ionden.com/a/plugins/ion.calendar/
// GitHub page:     https://github.com/IonDen/ion.calendar
//
// Released under MIT licence:
// http://ionden.com/a/plugins/licence-en.html
// =====================================================================================================================
var rootUrl='http://'+location.host;
var updatedAttendance;
var users;
var updateUser=function(userid){
  var inputDutyHours = $('#inputDutyHours').val();
    if(!inputDutyHours)inputDutyHours=0;
    var inputStatus = $('#inputStatus').val();
      if(!inputStatus)inputStatus=0;
  var modal = document.getElementById('myModal');
modal.style.display = "none";
  $.ajax({
  type:'GET',
  url:rootUrl+'/admin/updateUser/'+userid+'/'+inputDutyHours+'/'+inputStatus,
  contentType: 'application/json',
  success: function(responseText, status, xhr){

if (responseText.status == 1) {    location.href= location.href;}


if (responseText.status == -1) alert("Data not found");


  },
  error: function(XMLHttpRequest, textStatus, errorThrown){
    alert('Error: ' + textStatus);
  }

});

};


var updateUserPopup=function(userid){
  var modal = document.getElementById('myModal');
  var innerModal = document.getElementById('innerModal');



  var dutyHrs,user,status;
 if(users&&users[userid]&&users[userid].hasOwnProperty("dutyHours"))
   dutyHrs=users[userid]["dutyHours"];
   if(users&&users[userid]&&users[userid].hasOwnProperty("status"))
     status=users[userid]["status"];
  else status=0;


  innerModal.innerHTML='<div class="row"><div class="col-sm-12">'+users[userid]["name"]+'</div></div>';
  innerModal.innerHTML+='<div class="row"><div class="col-sm-4"><div class="input-group"><span class="input-group-addon">Duty Hours</span><input type="text" id="inputDutyHours" class="form-control" value="'+dutyHrs+'" placeholder="Duty Hours"></div></div></div>';
if(status===1){
  innerModal.innerHTML+='<div class="row"><div class="col-sm-4"><div class="input-group"><span class="input-group-addon">Status</span><select id="inputStatus" class="form-control"><option value="0">Regular</option><option value="1" selected="selected">Manager</option></select></div></div></div>';
}
else {innerModal.innerHTML+='<div class="row"><div class="col-sm-4"><div class="input-group"><span class="input-group-addon">Status</span><select id="inputStatus" class="form-control"><option value="0" selected="selected">Regular</option><option value="1" >Manager</option></select></div></div></div>';
}
innerModal.innerHTML+='<div class="row"><button class=add-btn id=add-btn onclick=updateUser("'+users[userid]['_id']+'");>Update User</button></div>';
  modal.style.display = "block";
}
 var removeAttendance=function(month,day,userid){


   var modal = document.getElementById('myModal');
modal.style.display = "none";
  $.ajax({
  type:'GET',
  url:rootUrl+'/admin/removeAttendance/'+userid+'/'+month+'/'+day,
  contentType: 'application/json',
  success: function(responseText, status, xhr){

if (responseText.status == 1) {    location.href= location.href;}


if (responseText.status == -1) alert("Data not found");


  },
  error: function(XMLHttpRequest, textStatus, errorThrown){
    alert('Error: ' + textStatus);
  }

});

};
 var addAttendance=function(month,day,userid){

  var inputOT = $('#inputOT').val();
   var inputRemarks = $('#inputRemarks').val();
   if(!inputRemarks)inputRemarks='No Remarks';
  var modal = document.getElementById('myModal');
modal.style.display = "none";
  $.ajax({
  type:'GET',
  url:rootUrl+'/admin/insertAttendance/'+userid+'/'+month+'/'+day+'/'+inputRemarks+'/'+inputOT,
  contentType: 'application/json',
  success: function(responseText, status, xhr){

if (responseText.status == 1) {    location.href= location.href;}


if (responseText.status == -1) alert("Data not found");


  },
  error: function(XMLHttpRequest, textStatus, errorThrown){
    alert('Error: ' + textStatus);
  }

});

};


(function($){
    try {
        var timeNow = moment();

var currentData,
    currentUsername,
    currentUserId,
    currentUserDutyHours;

    } catch(e){
        alert("Can't find Moment.js, please read the ion.calendar description.");
        throw new Error("Can't find Moment.js library");
    }

    var methods = {
        init: function(options){
            var settings = $.extend({
                    lang: "en",
                    sundayFirst: true,
                    years: "80",
                    format: "",
                    clickable: true,
                    startDate: "",
                    hideArrows: false,
                    onClick: null,
                    onReady: null,

                }, options),
                html, i;


            return this.each(function(){
                var $calendar = $(this);

                //prevent overwrite
                if($calendar.data("isActive")) {
                    return;
                }
                $calendar.data("isActive", true);



                var $prev,
                    $next,
                    $month,
                    $year,
                    $day,

                    timeSelected,
                    timeNowLocal = moment(timeNow.locale(settings.lang)),
                    timeForWork,
                    weekFirstDay,
                    weekLastDay,
                    monthLastDay,
                    totalHours=0,
                    regularHours=0,
                    otHours=0,

                    tempYears,
                    fromYear,
                    toYear,
                    firstStart = true;



                // public methods
                this.updateData = function(options){
                    settings = $.extend(settings, options);
                    removeHTML();
                };


                // private methods
                var removeHTML = function(){
                    $prev.off();
                    $next.off();
                    $month.off();
                    $year.off();
                    $calendar.empty();


                    totalHours=0;
                    regularHours=0;
                    otHours=0;

                };

                var getData = function(){
                  var pathArray = window.location.pathname.split( '/' );
                  $.ajax({
                    type:'GET',
dataType: "json",


                    url:rootUrl+'/users/groupTest/'+pathArray[3]+'/'+timeNowLocal.month(),
                     success: function(responseText, status, xhr){
                    if (responseText.status == 1) {
                      users=responseText.dataset;
                      prepareData();
                      prepareCalendar();
                      for(var j=0;j<users.length;j++)
                      {
                        currentUsername=users[j]['name'];
                        currentData=users[j]['attendance'];
                        currentUserId=j;
                        currentUserDutyHours=users[j]['dutyHours'];
if(!currentUserDutyHours)currentUserDutyHours=0;
                         prepareAttendance();

                        placeCalendar();
                        }
                    }
                    if (responseText.status == 0) alert("Data not found");


                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                      alert('Error: ' + textStatus);


                    },
                    complete:function(xhr,status){




                    }

                  });
                };
                var prepareData = function(){

                    // start date
                    if(settings.startDate) {
                        if(settings.format.indexOf("L") >= 0) {
                            timeSelected = moment(settings.startDate, "YYYY.MM.DD").locale(settings.lang);
                        } else {
                            timeSelected = moment(settings.startDate, settings.format).locale(settings.lang);
                        }
                    }


                    // years diapason
                    settings.years = settings.years.toString();
                    tempYears = settings.years.split("-");
                    if(tempYears.length === 1) {
                        fromYear = moment().subtract("years", tempYears[0]).format("YYYY");
                        toYear = moment().format("YYYY");
                    } else if(tempYears.length === 2){
                        fromYear = tempYears[0];
                        toYear = tempYears[1];
                    }
                    fromYear = parseInt(fromYear);
                    toYear = parseInt(toYear);

                    if(toYear < timeNowLocal.format("YYYY")) {
                        timeNowLocal.year(toYear).month(11);
                    }
                    if(fromYear > timeNowLocal.format("YYYY")) {
                        timeNowLocal.year(fromYear).month(0);
                    }


                };

                var prepareAttendance=function(){
html+='<div class="row mt">';
html +='<div class="col-md-12">';
var currentTotalhours=0,currentTotalRhours=0,currentTotalOThours=0;
var html2='';
                  if(settings.sundayFirst) {


                      // week
                      html2 += '<table class="ic__week-head"><tr>';
                      for(i = 0; i < 7; i++) {
                          html2 += '<td>' + timeForWork.day(i).format("dd") + '</td>';
                      }
                      html2 += '</tr></table>';

                      // month
                      html2 += '<table class="ic__days"  id="'+currentUserId+'"><tr>';
                      // empty days
                      for(i = 0; i < weekFirstDay; i++) {
                          html2 += '<td class="ic__day-empty">&nbsp;</td>';
                      }
                      var thisMonth =   timeNowLocal.month();


                       // days
                      for(i = 1; i <= monthLastDay; i++) {

                          // current day
                          if(timeSelected && moment(timeNowLocal).date(i).format("D.M.YYYY") === timeSelected.format("D.M.YYYY")) {
                              html2 += '<td class="ic__day ic__day_state_selected">' + i + '</td>';
                          }
                          else {
                            if(currentData&&currentData.hasOwnProperty(thisMonth)){


                              if(currentData[thisMonth][i]){
 currentTotalRhours++;
                                var OT=Number(currentData[thisMonth][i]["OT"]);
                                if(OT){
                                  currentTotalOThours+=OT;
                                  html2 += '<td class="ic__day ic__day_state_attendance_OT">'+i+'</td>';
                                }

                else if(!OT||OT==0){
                                html2 += '<td class="ic__day ic__day_state_attendance_regular">'+i+'</td>';
                }

                }
                else
                {                                    html2 += '<td class="ic__day">' + i + '</td>';}
                            }
                            else
                              html2 += '<td class="ic__day">' + i + '</td>';
                          }


                          // new week - new line
                          if((weekFirstDay + i) / 7 === Math.floor((weekFirstDay + i) / 7)) {
                              html2 += '</tr><tr>';
                          }
                      }

                      // empty days
                      for(i = weekLastDay; i < 6; i++) {
                          html2 += '<td class="ic__day-empty">&nbsp;</td>';
                      }
                      currentTotalRhours=currentTotalRhours*currentUserDutyHours;
                      currentTotalhours=currentTotalRhours+currentTotalOThours;

                      html2 += '</tr></table>';
                      html += '<table class="ic__days">';

                      html +='<tr><td class="ic__day_user" id=add-btn onclick=updateUserPopup("'+currentUserId+'");>'+currentUsername+'</td>';
                      html +='<td class="ic__day_state_attendance_total">'+currentTotalhours+'</td>';

                      html +='<td class="ic__day_state_attendance_regular">'+currentTotalRhours+'</td>';
                      html +='<td class="ic__day_state_attendance_OT">'+currentTotalOThours+'</td>';


                      html += '</tr></table>';
                      html+=html2;
                  } else {

                      // week
                      html += '<table class="ic__week-head"><tr>';
                      for(i = 1; i < 8; i++) {
                          if(i < 7) {
                              html += '<td>' + timeForWork.day(i).format("dd") + '</td>';
                          } else {
                              html += '<td>' + timeForWork.day(0).format("dd") + '</td>';
                          }
                      }
                      html += '</tr></table>';

                      // days
                      html += '<table class="ic__days"><tr>';

                      // empty days
                      if(weekFirstDay > 0) {
                          weekFirstDay = weekFirstDay - 1;
                      } else {
                          weekFirstDay = 6;
                      }
                      for(i = 0; i < weekFirstDay; i++) {
                          html += '<td class="ic__day-empty">&nbsp;</td>';
                      }
                      var Data;
                       for(i = 1; i <= monthLastDay; i++) {

                          // new week - new line
                          if((weekFirstDay + i) / 7 === Math.floor((weekFirstDay + i) / 7)) {
                              html += '</tr><tr>';
                          }
                      }
                      // empty days
                      if(weekLastDay < 1) {
                          weekLastDay = 7;
                      }
                      for(i = weekLastDay - 1; i < 6; i++) {
                          html += '<td class="ic__day-empty">&nbsp;</td>';
                      }
                      html += '</tr>';
                      html += '</table>';


                  }

                  regularHours+=currentTotalRhours;
                  otHours+=currentTotalOThours;
                  totalHours=regularHours+otHours;

                  html += '</div>';
                  html += '</div>';


                };

                var prepareCalendar = function(){

                    timeForWork = moment(timeNowLocal);

                    weekFirstDay = parseInt(timeForWork.startOf("month").format("d"));
                    weekLastDay = parseInt(timeForWork.endOf("month").format("d"));
                    monthLastDay = parseInt(timeForWork.endOf("month").format("D"));

                    html  = '<div class="ic__container">';
                    html += '<div class="ic__header">';
                    html += '<div class="ic__prev"><div></div></div>';
                    html += '<div class="ic__next"><div></div></div>';

                    // head month
                    html += '<div class="ic__month"><select class="ic__month-select">';
                    for(i = 0; i < 12; i++){
                        if(i === parseInt(timeNowLocal.format("M")) - 1){
                            html += '<option value="' + i + '" selected="selected">' + timeForWork.month(i).format("MMMM") + '</option>';
                        } else {
                            html += '<option value="' + i + '">' + timeForWork.month(i).format("MMMM") + '</option>';
                        }
                    }
                    html += '</select></div>';

                    // head year
                    html += '<div class="ic__year"><select class="ic__year-select">';
                    for(i = fromYear; i <= toYear; i++){
                        if(i === parseInt(timeNowLocal.format("YYYY"))){
                            html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                        } else {
                            html += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                    html += '</select></div>';

                    html += '</div>';


                };

                var placeCalendar = function(){
                  var thours=document.getElementById('tdata');
                  var othours=document.getElementById('otdata');
                  var rhours=document.getElementById('rdata');
                  thours.innerHTML=totalHours;

                  othours.innerHTML=otHours;
                  rhours.innerHTML=regularHours;
                    $calendar.html(html);

                    $prev = $calendar.find(".ic__prev");
                    $next = $calendar.find(".ic__next");
                    $month = $calendar.find(".ic__month-select");
                    $year = $calendar.find(".ic__year-select");
                    $day = $calendar.find(".ic__day");

                    if(settings.hideArrows) {
                        $prev[0].style.display = "none";
                        $next[0].style.display = "none";
                    } else {
                        $prev.on("click", function(e){
                            e.preventDefault();
                            timeNowLocal.subtract("months", 1);
                            if(parseInt(timeNowLocal.format("YYYY")) < fromYear) {
                                timeNowLocal.add("months", 1);
                            }
                            removeHTML();
                             getData();
                        });
                        $next.on("click", function(e){
                            e.preventDefault();
                            timeNowLocal.add("months", 1);
                            if(parseInt(timeNowLocal.format("YYYY")) > toYear) {
                                timeNowLocal.subtract("months", 1);
                            }
                            removeHTML();
                       getData();
                        });
                    }

                    $month.on("change", function(e){
                        e.preventDefault();
                        var toMonth = $(this).prop("value");
                        timeNowLocal.month(parseInt(toMonth));
                        removeHTML();
                     getData();
                    });
                    $year.on("change", function(e){
                        e.preventDefault();
                        var toYear = $(this).prop("value");
                        timeNowLocal.year(parseInt(toYear));
                        removeHTML();
                     getData();
                    });

                    if(settings.clickable) {
                        $day.on("click", function(e){
                            e.preventDefault();
                            var toDay = $(this).text();
                            var tableID = $(this).closest('table').attr('id');
                            if(tableID&&users[tableID].hasOwnProperty('attendance'))
currentData=users[tableID]['attendance'];

                            timeNowLocal.date(parseInt(toDay));
                            timeSelected = moment(timeNowLocal);
                            if(settings.format.indexOf("L") >= 0) {
                                settings.startDate = timeSelected.format("YYYY-MM-DD");
                            } else {
                                settings.startDate = timeSelected.format(settings.format);
                            }
                            var thisMonth =   timeNowLocal.month();

                            // trigger callback function
                            if(typeof settings.onClick === "function") {
                              var innermodal = document.getElementById('innerModal');
                              var OT;
                              var remarks;
                               var dutyHrs;
if(innermodal&&currentData&&currentData.hasOwnProperty(thisMonth)&&currentData[thisMonth].hasOwnProperty(toDay)){


  OT=currentData[thisMonth][toDay]["OT"];
  remarks=currentData[thisMonth][toDay]["remarks"];
  dutyHrs=currentData["dutyHours"];
 }
  if(!dutyHrs)dutyHrs=0;

  if(!remarks)remarks='';
 if(!OT)OT=0;

       innermodal.innerHTML='<div class="row"><div class="col-sm-12">'+timeSelected.format("YYYY-MM-DD")+'</div></div>';
      innermodal.innerHTML+='<div class="row"><div class="col-sm-4"><div class="input-group"><span class="input-group-addon">Overtime</span><input type="text" id="inputOT" class="form-control" value="'+OT+'" placeholder="OT"></div></div><div class="col-sm-8"><div class="input-group"><span class="input-group-addon">Remarks</span><input type="text" id="inputRemarks" class="form-control" placeholder="Remarks" value="'+remarks+'"></div></div></div>';


  innermodal.innerHTML+='<div class="row"><div class="col-sm-6"><button class=add-btn id=add-btn onclick=addAttendance('+thisMonth+','+toDay+',"'+users[tableID]['_id']+'");>Add Attendance</button></div><div class="col-sm-6"><button class=add-btn id=add-btn onclick=removeAttendance('+thisMonth+','+toDay+',"'+users[tableID]['_id']+'");>Remove</button></div></div>';


                                if(settings.format) {
                                    if(settings.format === "moment") {
                                        settings.onClick.call(this, timeSelected);
                                    } else {
                                        settings.onClick.call(this, timeSelected.format(settings.format));
                                    }
                                } else {
                                    settings.onClick.call(this, timeSelected.format());
                                }
                            }


                        });

                    }

                    // trigger onReady function
                    if(typeof settings.onReady === "function") {
                        if(settings.format) {
                            if(settings.format === "moment") {
                                settings.onReady.call(this, timeNowLocal);
                            } else {
                                settings.onReady.call(this, timeNowLocal.format(settings.format));
                            }
                        } else {
                            settings.onReady.call(this, timeNowLocal.format());
                        }
                    }

                    // go to startDate
                    if(settings.startDate && firstStart) {
                        firstStart = false;
                        timeNowLocal.year(parseInt(timeSelected.format("YYYY")));
                        timeNowLocal.month(parseInt(timeSelected.format("M") - 1));
                     }
                };


 getData();




            });
        },
        update: function(options){
            return this.each(function(){
                this.updateData(options);
            });
        }
    };

    $.fn.ionCalendar = function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist for jQuery.ionCalendar');
        }
    };
})(jQuery);



// =====================================================================================================================
// Ion.DatePicker
// support plugin for ion.calendar

(function($){
    var pluginCount = 0,
        html,
        $body = $(document.body);

    var closePopups = function(){
        $(".ic__datepicker").css("left", "-9999px").css("top", "-9999px");
    };

    var methods = {
        init: function(options){
            var settings = $.extend({
                lang: "en",
                sundayFirst: true,
                years: "80",
                clickable: true,
                format: ""
            }, options);

            return this.each(function(){
                var $input = $(this),
                    $popup,
                    tempData = {},
                    self = this,
                    x, y, w,
                    selectedDate,
                    currentDate,
                    testDate;

                //prevent overwrite
                if($input.data("isActive")) {
                    return;
                }
                $input.data("isActive", true);

                pluginCount++;
                this.pluginCount = pluginCount;

                // change settings from data
                tempData.lang = $input.data("lang") || settings.lang;
                if($input.data("sundayfirst") === false) {
                    tempData.sundayFirst = $input.data("sundayfirst");
                }
                tempData.years = $input.data("years") || settings.years;
                tempData.format = $input.data("format") || settings.format;
                $.extend(settings, tempData);


                $body.on("mousedown", function(){
                    closePopups();
                });


                settings.onClick = function(date){
                    $input.prop("value", date);
                    selectedDate = date;
                    closePopups();
                };

                var preparePopup = function(){
                    html = '<div class="ic__datepicker" id="ic__datepicker-' + self.pluginCount + '"></div>';
                    $body.append(html);
                    $popup = $("#ic__datepicker-" + self.pluginCount);
                    $popup.ionCalendar(settings);

                    $popup.on("mousedown", function(e){
                        e.stopPropagation();
                    });
                    $input.on("mousedown", function(e){
                        e.stopPropagation();
                    });
                    $input.on("focusin", function(){
                        closePopups();
                        openPopup();
                    });
                    $input.on("keyup", function(){
                        openPopup();
                    });
                };

                var openPopup = function(){
                    x = parseInt($input.offset().left);
                    y = parseInt($input.offset().top);
                    w = parseInt($input.outerWidth(true));

                    $popup.css("left", (x + w + 10) + "px").css("top", (y - 10) + "px");


                    currentDate = $input.prop("value");
                    if(currentDate && currentDate !== selectedDate && settings.format.indexOf("L") < 0) {
                        testDate = moment(currentDate, settings.format);
                        if(testDate.isValid()) {
                            $popup.ionCalendar("update", {
                                startDate: currentDate
                            });
                        }
                    }

                };


                // yarrr!
                preparePopup();
            });
        },
        close: function(){
            closePopups();
        }
    };


    $.fn.ionDatePicker = function(method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist for jQuery.ionDatePicker');
        }
    };
})(jQuery);
