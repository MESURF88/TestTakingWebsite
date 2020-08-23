function mbtiInfo(){
    if($("#mbtiDesc").is(":hidden")){
        $("#mbtiDesc").show();
        $("#mbtiButton").removeClass('btn btn-info');
        $("#mbtiButton").addClass('btn btn-danger');
        $("#mbtiButton").html("close");
    }
    else{
        $("#mbtiButton").removeClass('btn btn-danger');
        $("#mbtiButton").addClass('btn btn-info');
        $("#mbtiButton").html("more info");
        $("#mbtiDesc").hide();
    } 
};