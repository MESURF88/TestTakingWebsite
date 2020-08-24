function fpqInfo(){
    if($("#fpqDesc").is(":hidden")){
        $("#fpqDesc").show();
        $("#fpqButton").removeClass('btn btn-info');
        $("#fpqButton").addClass('btn btn-danger');
        $("#fpqButton").html("close");
    }
    else{
        $("#fpqButton").removeClass('btn btn-danger');
        $("#fpqButton").addClass('btn btn-info');
        $("#fpqButton").html("more info");
        $("#fpqDesc").hide();
    } 
};