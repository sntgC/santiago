$(document).ready(function(){
    $(".fixed-header").hide();
    $(document).on("scroll",function(){
        var top=$(document).scrollTop();
        if(top>0){
            if($(".header").css("opacity")==1){
                console.log("init");
                $(".header").css("opacity",0);
                shiftHeader(".fixed-header");
            }
        }else{
            unShiftHeader(".fixed-header");
        }
    })
});

function shiftHeader(c){
    $(c).show();
    $(c).addClass("black");
    $(".small-filler").animate({flexGrow:1},500);
}

function unShiftHeader(c){
    $(c).removeClass("black");
    $(".small-filler").animate({flexGrow:.001},250,function(){
        $(c).hide();
        $(".header").css("opacity",1);
    });
}
