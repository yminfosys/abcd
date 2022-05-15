function viewTenant(proofid){
    var image = document.getElementById('img');
    image.src = proofid
    // image.style.width='100vh';
    //image.style.display='block'

    $("#imgbox").css({
       "display":"block"
    })

    
}

function closeviewTenant(){
    $("#imgbox").css({
        "display":"none"
     }) 
}

function verifyTenant(id){
    $.post('/admin/verifyTenant',{id:id},function(data){
        $("#tenant"+id+"").css({ "display":"none"})
    })
    
}

function verifyProperty(id){
    $.post('/admin/verifyProperty',{id:id},function(data){
        $("#propery"+id+"").css({ "display":"none"})
    })
}

function verifyExistingProperty(propertyID,tenantID){

    $.post('/admin/verifyExistingProperty',{propertyID:propertyID,tenantID:tenantID},function(data){
        $("#tenant"+data.tenantID+"").css({ "display":"none"})

    })

}

function ViewPropertyVeryfy(propertyID){
    $.post('/admin/ViewPropertyVeryfy',{propertyID:propertyID},function(data){
       if(data){
        $("#viewBox").css({ "display":"block"})
        $("#viewContent").html('<div style="margin-top: 20px;" class="row">\
        <div style="margin-bottom: 10px;"  class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">\
          <ul class="list-group">\
            <li class="list-group-item" style="font-size: 18px; font-weight: bold; color: rgb(16, 26, 117);">\
                Name : '+data.name+'\
            </li>\
            <li class="list-group-item">\
                Status : '+data.status+'<br><br>\
                <p>Address : '+data.doorNo+', '+data.address+' ,<br>Post Code: '+data.postCode+'</p>\
            </li>\
            <li class="list-group-item list-group-item-success" >\
              <span class="badge"></span>\
              Tenant rating '+Number(data.rating).toFixed(0)+' <i  class="fa fa-star" aria-hidden="true"></i>\
          </li>\
          </ul>\
        </div>\
        </div>')
        
       }
    })
}

function closeviewBox(){
    $("#viewBox").css({ "display":"none"})
}