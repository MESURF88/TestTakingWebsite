function discInfo(){
    if($("#discDesc").is(":hidden")){
        $("#discDesc").show();
        $("#discButton").removeClass('btn btn-info');
        $("#discButton").addClass('btn btn-danger');
        $("#discButton").html("close");
    }
    else{
        $("#discButton").removeClass('btn btn-danger');
        $("#discButton").addClass('btn btn-info');
        $("#discButton").html("more info");
        $("#discDesc").hide();
    } 
};