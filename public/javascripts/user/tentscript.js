function addnewproperty(){

    $("#box2").css({"display":"none"})
    $("#box1").css({"display":"block"})
    

}
function closeaddproperty(){
    $("#box1").css({"display":"none"})
    $("#addProp").css({"display":"none"})
    $("#searchProp").css({"display":"block"}) 
    $("#box2").css({"display":"block"}) 
    $("#veryfiyourself").css({"display":"none"})
}

function searchProperty(){
    var postcode=$("#postCode").val();
    postcode=postcode.replace(/\s/g, '').toUpperCase();
    $.post('/users/searchProperty',{postCode:postcode},function(data){
       
       if(data.length>0){
        $("#propList").html('')
           data.forEach(val => {
            $("#propList").append('<li onclick="addpropertylease('+val.propertyID+')" class="list-group-item">\
            <span class="badge">\
              <img  src="'+val.imgMain+'" class="" style="width:50px; height: 50px;" alt="Image">\
            </span>\
            Name: '+val.name+'<br>\
            Address: '+val.doorNo+', '+val.address+' ,<br>Post Code: '+val.postCode+'\
          </li>') 
           });
       
       }else{
        $("#propList").html('')
           $("#propList").append('<button onclick="requestProperty()" type="button" class="btn btn-block btn-defalt">Request new Porperty<img  src="/images/home.png" class="" style="width:50px; height: 50px;" alt="Image"></button>')
       }
    })
    
}



function requestProperty(){
    $("#propList").html('');
    $("#searchProp").css({"display":"none"});
    $("#addProp").css({"display":"block"});
}


function chengeImg(url){
    var image = document.getElementById('imgMainBox');
    image.src = url
}

function addpropertylease(propertyID){
    //alert(propertyID)
    // $.post('/users/addpropertyTolease',{propertyID:propertyID},function(data){
    //     if(data){
    //         window.location.href='/users/login'
    //     }
    // })
    $("#veryfiyourself").css({"display":"block"});
    $("#veryfiyourself").html(' <div class="panel-heading">\
    <h3 class="panel-title">Verify Your Self</h3>\
  </div>\
  <div class="panel-body">\
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
      <div class="thumbnail">\
        <img id="imgadsprf" src="/images/home.png"  alt="Image">\
        <div class="caption" style="text-align: center;">\
          <form action="/users/verifyyourselveRequest" method="POST" enctype="multipart/form-data"  role="form">\
              <input type="file"  accept="image/*" capture="camera" name="file6" id="file6"  onchange="loadFileAds(event)" style="display: none; width: 100%;">\
              <label class="btn btn-default" for="file6" style="cursor: pointer;">Property Address Proof <i class="fa fa-camera" aria-hidden="true"></i></label>\
              <p>Ex: Bank Statement, Gas Electric bill, Phone bill, Rent agreement, Rent Slip Etc</p>\
                <input type="hidden" name="propertyID" value="'+propertyID+'">\
              <button   type="submit" class="btn btn-success">Submit</button>\
        </form>\
        </div>\
      </div>\
    </div>\
  </div>')
}





function propertyFeedback(propertyID,name,tenantID){
$("#box2").css({"display":"none"})
$("#box3").css({"display":"block"})
$("#updatebtn").html(' <button onclick="updateFeedback(\''+name+'\', \''+tenantID+'\' ,\''+propertyID+'\')"  type="button" class="btn btn-default">Submit</button>')
$.post('/users/propertyAndfeedbackDetails',{propertyID:propertyID}, async function(data){

  if(data.property){
    $("#proprtyName").text(data.property.name);
    $("#propertyImg").attr('src',data.property.imgMain);
     for (let i = 0; i <= data.property.rating; i++) {
      $("#propertyStar"+i+"").addClass("yellow");
      }
      $("#oldFeedback").html('');
      data.feedbac.forEach(val => {
      $("#oldFeedback").append('<li class="list-group-item"><h4>'+val.ratingname+':</h4> '+val.rating+' <i class="fa fa-star" aria-hidden="true"></i>\
      <br>Msg: '+val.detailsrating+' </li>')
      });
    }

    

})



}

function updateFeedback(name,tenantID,propertyID){
var selectrdRating=$("#selectrdRating").val();
var detailsrating=$("#inputfeedback").val();
if(selectrdRating){
  $.post('/users/updatePropertyFeedback',{
    name:name,
    tenantID:tenantID,
    propertyID:propertyID,
    ratingby:"Tenant",
    rating:selectrdRating,
    detailsrating:detailsrating
  
  },function(data){
  if(data){
    $("#box2").css({"display":"block"})
    $("#box3").css({"display":"none"})
  }
  })
}else{
  alert("Select Rating")
}



}

$( document ).ready(function() {
    let stars = Array.from(document.querySelectorAll(".abc"));
    stars.forEach((element) => {
      element.addEventListener("click", (e) => {
        rate(element);
      });
      /********** */
      element.addEventListener("mouseover", (e) => {
        rate(element);
      });
    });
    
    function rate(element) {
      stars.forEach((el) => {
        el.classList.remove("selected");
      });
      selectedRating = stars.indexOf(element);
      $("#selectrdRating").val(selectedRating+1)
      for (let i = 0; i <= selectedRating; i++) {
        stars[i].classList.add("selected");
      }
    }
    
    var rating=$("#selectrdRating").val();
    for (let i = 0; i <= 3; i++) {
        $("#propertyStar"+i+"").addClass("yellow");
      }
})



