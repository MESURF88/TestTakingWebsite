function eqInfo(){
    if($("#eqDesc").is(":hidden")){
        $("#eqDesc").show();
        $("#eqButton").removeClass('btn btn-info');
        $("#eqButton").addClass('btn btn-danger');
        $("#eqButton").html("close");
    }
    else{
        $("#eqButton").removeClass('btn btn-danger');
        $("#eqButton").addClass('btn btn-info');
        $("#eqButton").html("more info");
        $("#eqDesc").hide();
    } 
};