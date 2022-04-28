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