function chronoInfo(){
    if($("#chronoDesc").is(":hidden")){
        $("#chronoDesc").show();
        $("#chronoButton").removeClass('btn btn-info');
        $("#chronoButton").addClass('btn btn-danger');
        $("#chronoButton").html("close");
    }
    else{
        $("#chronoButton").removeClass('btn btn-danger');
        $("#chronoButton").addClass('btn btn-info');
        $("#chronoButton").html("more info");
        $("#chronoDesc").hide();
    } 
};