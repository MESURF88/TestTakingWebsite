$(document).ready(function(){
    $(function(){
        $('#top-navigation a').filter(function(){return this.href==location.href}).addClass('nav-link active').css("color", "black").siblings().removeClass('nav-link active').css("color", "white");
        $('#top-navigation a').click(function(){
            $(this).addClass('nav-link active').css("color", "black").siblings().removeClass('nav-link active').css("color", "white");
        })
        //After redirect highlight results tab
        if ("/results" == location.pathname){
            $("#resultsTab").trigger("click");
        }
    });
 });



