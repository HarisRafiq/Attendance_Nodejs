
var something = function(name,dept,hrs,access_level) {
  var modal = document.getElementById('myModal');
  var innerModal = document.getElementById('innerModal');

innerModal.innerHTML='<div class="row"><div class="col-sm-12">'+name+'</div></div>';
innerModal.innerHTML+='<div class="row"><div class="col-sm-4"><label>Duty Hours</label><br><input id="inputHrs" type="text" value='+hrs+'></input></div><div class="col-sm-4"><label>Department</label><br><input id="inputDept" type="text" value='+dept+'></input></div><div class="col-sm-4"><label>Access Level</label><br><select id="selectGroup"></select></div></div>';


innerModal.innerHTML+='<div class="row"><div class="col-sm-12"><button class=add-btn id=add-btn>Save</button></div></div>';

  modal.style.display = "block";


 }
 var deleteUser=function(userID){
   $.ajax({
    url: '/admin/deleteUser/'+userID,
    dataType: 'json',
    type: 'get',
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
 var deleteGroup=function(groupID){
   $.ajax({
    url: '/admin/removeGroup',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify( { "group_id": groupID } ),
    processData: false,
    success: function( data, textStatus, jQxhr ){
           location.reload();

    },
    error: function( jqXhr, textStatus, errorThrown ){
        console.log( errorThrown );
    }
});

 };
 var saveGroup=function(name){
   var nameInput = document.getElementById('inputName').value;

   $.ajax({
    url: '/admin/addGroup',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify( { "groupName": nameInput } ),
    processData: false,
    success: function( data, textStatus, jQxhr ){
         var modal = document.getElementById('groupModal');



        modal.style.display = "none";
 location.reload();

    },
    error: function( jqXhr, textStatus, errorThrown ){
        console.log( errorThrown );
    }
});
 }
 var creategroupPopUp=function(){
   var modal = document.getElementById('groupModal');
   var innerModal = document.getElementById('groupInnerModal');

   innerModal.innerHTML='<div class="row"><div class="col-sm-12">Create New Group</div></div>';
   innerModal.innerHTML+='<div class="row"><div class="col-sm-12"><label>Name</label><br><input id="inputName" type="text"></input></div></div>';


   innerModal.innerHTML+='<div class="row"><div class="col-sm-12"><button class=add-btn id=add-btn onclick=saveGroup()>Save</button></div></div>';

   modal.style.display = "block";
   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[1];
   // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
   modal.style.display = "none";
   }
   window.onclick = function(event) {
   if (event.target == modal) {
       modal.style.display = "none";
   }
}
 }
 function startUP(){
   // Get the modal
   var modal = document.getElementById('myModal');


   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];
   // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
   modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
   if (event.target == modal) {
       modal.style.display = "none";
   }

 }
 }


startUP();
