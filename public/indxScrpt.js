function searchproperty(){
var propertytype=$("#propertytype").val();
var postCode=$("#serchPostcode").val();
var landlordName=$("#landlordName").val();

$.post('/searchproperty',{propertytype:propertytype,postCode:postCode,landlordName:landlordName},function(data){
    $("#searchCont").html('');
    $("#Search").css({"display":"block"})
    $("#owl-slider").css({"display":"none"})
    $("#contain").css({"display":"none"})

   
    if(data.length >0){
        data.forEach(val => {
            $("#searchCont").append('<div style="margin-top: 20px;" class="row">\
<div style="margin-bottom: 10px;"  class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
    <a href="#" class="thumbnail">\
      <img id="'+val.propertyID+'imgMainBox" src="'+val.imgMain+'" class="img-rounded" alt="Image">\
    </a>\
  </div>\
    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">\
      <img onclick="chengeImg(\'' + val.imgMain + '\',\'' + val.propertyID + '\')" src="'+val.imgMain+'" style="width: 6vh; height: 6vh; border-radius: 10px; border: 1px solid #000;" class="img-rounded" alt="Image">\
    </div>\
    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">\
      <img onclick="chengeImg(\'' + val.impOp1 + '\',\'' + val.propertyID + '\')" src="'+val.impOp1+'" style="width: 6vh; height: 6vh; border-radius: 10px; border: 1px solid #000;" class="img-rounded" alt="Image">\
    </div>\
    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">\
      <img onclick="chengeImg(\'' + val.impOp2 + '\',\'' + val.propertyID + '\')" src="'+val.impOp2+'" style="width: 6vh; height: 6vh; border-radius: 10px; border: 1px solid #000;" class="img-rounded" alt="Image">\
    </div>\
    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">\
      <img onclick="chengeImg(\'' + val.impOp3 + '\',\'' + val.propertyID + '\')" src="'+val.impOp3+'" style="width: 6vh; height: 6vh; border-radius: 10px; border: 1px solid #000;" class="img-rounded" alt="Image">\
    </div>\
</div>\
<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">\
  <ul class="list-group">\
    <li class="list-group-item" style="font-size: 18px; font-weight: bold; color: rgb(16, 26, 117);">\
        Name : '+val.name+'\
    </li>\
    <li class="list-group-item">\
        Type : '+val.type+'<br><br>\
        <p>Address : '+val.doorNo+', '+val.address+' ,<br>Post Code: '+val.postCode+'</p>\
    </li>\
    <li class="list-group-item list-group-item-success" >\
      <span <button onclick="showDetailsPropertyFeedback(' + val.propertyID + ')" class="badge">Feedback Details</span>\
      Proprty rating '+val.rating.toFixed(0)+' <i  class="fa fa-star" aria-hidden="true"></i> \
  </li>\
  </ul>\
  <div id="feedbackDetails"></div>\
</div>\
</div>');
            
        });

    }else{
        $("#searchCont").html('No Result Found');  
    }


})
}

function chengeImg(url,id){
    var image = document.getElementById(''+id+'imgMainBox');
    image.src = url
}

function closeSearch(){
    $("#Search").css({"display":"none"})
    $("#owl-slider").css({"display":"block"})
    $("#contain").css({"display":"block"})
}


function showDetailsPropertyFeedback(propertyID){
  $.post('/showDetailsPropertyFeedback',{propertyID:propertyID}, async function(data){
   
        data.feedbac.forEach(val => {
        $("#feedbackDetails").append('<li class="list-group-item"><h4>'+val.ratingname+':</h4> '+val.rating+' <i class="fa fa-star" aria-hidden="true"></i>\
        <br>Msg: '+val.detailsrating+' </li>')
        });
  })

}



function tenantSearch(){
var tenanttytype=$("#tenanttytype").val();
var tenantPostCode=$("#tenantPostCode").val();
var tenantName=$("#tenantName").val();

$.post('/searchtenant',{tenanttytype:tenanttytype,tenantPostCode:tenantPostCode,tenantName:tenantName},function(data){
    $("#searchCont").html('');
    $("#Search").css({"display":"block"})
    $("#owl-slider").css({"display":"none"})
    $("#contain").css({"display":"none"})

   
    if(data.length >0){
        data.forEach(val => {
            $("#searchCont").append('<div style="margin-top: 20px;" class="row">\
<div style="margin-bottom: 10px;"  class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">\
  <ul class="list-group">\
    <li class="list-group-item" style="font-size: 18px; font-weight: bold; color: rgb(16, 26, 117);">\
        Name : '+val.name+'\
    </li>\
    <li class="list-group-item">\
        Status : '+val.status+'<br><br>\
        <p>Address : '+val.doorNo+', '+val.address+' ,<br>Post Code: '+val.postCode+'</p>\
    </li>\
    <li class="list-group-item list-group-item-success" >\
      <span class="badge"></span>\
      Tenant rating '+val.rating+' <i  class="fa fa-star" aria-hidden="true"></i>\
  </li>\
  </ul>\
</div>\
</div>');
            
        });

    }else{
        $("#searchCont").html('No Result Found');  
    }


})

}