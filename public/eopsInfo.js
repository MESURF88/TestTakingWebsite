function eopsInfo(){
    if($("#eopsDesc").is(":hidden")){
        $("#eopsDesc").show();
        $("#eopsButton").removeClass('btn btn-info');
        $("#eopsButton").addClass('btn btn-danger');
        $("#eopsButton").html("close");
    }
    else{
        $("#eopsButton").removeClass('btn btn-danger');
        $("#eopsButton").addClass('btn btn-info');
        $("#eopsButton").html("more info");
        $("#eopsDesc").hide();
    } 
};