function jtInfo(){
    if($("#jtDesc").is(":hidden")){
        $("#jtDesc").show();
        $("#jtButton").removeClass('btn btn-info');
        $("#jtButton").addClass('btn btn-danger');
        $("#jtButton").html("close");
    }
    else{
        $("#jtButton").removeClass('btn btn-danger');
        $("#jtButton").addClass('btn btn-info');
        $("#jtButton").html("more info");
        $("#jtDesc").hide();
    } 
};