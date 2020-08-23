function spiritInfo(){
    if($("#spiritDesc").is(":hidden")){
        $("#spiritDesc").show();
        $("#spiritButton").removeClass('btn btn-info');
        $("#spiritButton").addClass('btn btn-danger');
        $("#spiritButton").html("close");
    }
    else{
        $("#spiritButton").removeClass('btn btn-danger');
        $("#spiritButton").addClass('btn btn-info');
        $("#spiritButton").html("more info");
        $("#spiritDesc").hide();
    } 
};