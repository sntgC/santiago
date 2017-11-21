$(document).ready(function(){
    $(".header-link").on("click",function(event){
        event.preventDefault();
        temp();
        var link=$(this).attr("href");
        setTimeout(function(){window.location.href=link},1190);
    });
    $(".fixed").hide();
    $(document).on("scroll",function(){
        var top=$(document).scrollTop();
        if(top>0){
            if($(".header").css("opacity")==1){
                console.log("init");
                $(".header").css("opacity",0);
                shiftHeader();
            }
        }else{
            unShiftHeader();
        }
    })
});

function shiftHeader(){
    $(".fixed").show();
    $(".fixed-header").show();
    $(".fixed-header").addClass("black");
    var h=$(".fixed-header").height();
    $(".fixed-header-bottom").addClass("white");
    $(".fixed-header-bottom").animate({top:-10-h/2},500);
    $(".small-filler").animate({flexGrow:1},500);
}

function unShiftHeader(){
    $(".fixed-header").removeClass("black");
    $(".fixed-header-bottom").removeClass("white");
    $(".fixed-header-bottom").animate({top:0},250);
    $(".small-filler").animate({flexGrow:.001},250,function(){
        $(".fixed-header").hide();
        $(".fixed").hide();
        $(".header").css("opacity",1);
    });
}
