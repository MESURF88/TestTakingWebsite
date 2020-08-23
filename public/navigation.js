$(document).ready(function(){
    $("#remove_test").hide();//modify for each test
    $(function(){
        $('#top-navigation a').filter(function(){return this.href==location.href}).addClass('nav-link active').css("color", "black").siblings().removeClass('nav-link active').css("color", "white");
        $('#top-navigation a').click(function(){
            $(this).addClass('nav-link active').css("color", "black").siblings().removeClass('nav-link active').css("color", "white");
        })
        //After redirect highlight results tab and hide descriptions intially
        if ("/results" == location.pathname){
            $("#resultsTab").trigger("click");
        }
    });
 });



