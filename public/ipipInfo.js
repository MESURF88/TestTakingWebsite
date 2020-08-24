function ipipInfo(){
    if($("#ipipDesc").is(":hidden")){
        $("#ipipDesc").show();
        $("#ipipButton").removeClass('btn btn-info');
        $("#ipipButton").addClass('btn btn-danger');
        $("#ipipButton").html("close");
    }
    else{
        $("#ipipButton").removeClass('btn btn-danger');
        $("#ipipButton").addClass('btn btn-info');
        $("#ipipButton").html("more info");
        $("#ipipDesc").hide();
    } 
};