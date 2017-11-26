var animations=true;
//----------THIS SHOULD BE MOVED---------
var bindArrow=function(){
    $("#down-arrow").on("click",function(){
        var h=$("#posts").offset().top;
        h-=$(".header").height();
        $("html, body").animate({ scrollTop: h+"px" }); 
    });
}
var switchView=function(a,timeout){
    if(animations)target=grow(ELEMENT);
    setTimeout(function(){
            shrink(ELEMENT);
            switch(a){
                case "index":
                    document.getElementById("router").innerHTML=Handlebars.templates.index();
                    document.getElementById("external-router").innerHTML="";
                    break;
                case "blog":
                    document.getElementById("router").innerHTML=Handlebars.templates.blog();
                    document.getElementById("external-router").innerHTML=Handlebars.templates['blog-posts']();
                    bindArrow();
                    break;
                case "projects":
                    document.getElementById("router").innerHTML=Handlebars.templates.projects();
                    document.getElementById("external-router").innerHTML=Handlebars.templates['projects-posts'](projects);
                    bindArrow();
                    break;
                case "about":
                    document.getElementById("router").innerHTML=Handlebars.templates.about();
                    document.getElementById("external-router").innerHTML="";
                    break;
                case "contact":
                    document.getElementById("router").innerHTML=Handlebars.templates.contact();
                    document.getElementById("external-router").innerHTML="";
                    break;
            }
        },timeout);
}

$(document).ready(function(){
    $(".header-link").on("click",function(event){
        event.preventDefault();
        var a=$(this).attr("href");
        a=a.substring(0,a.indexOf("."));
        if(window.screen.width>700&&animations){
            if($(document).scrollTop()>0){
                $("html, body").animate({ scrollTop: 0+"px" },100,switchView(a,1190)); 
            }else
                switchView(a,1190);
        }else
            switchView(a,0);
    });
    $(".fixed").hide();
    $(document).on("scroll",function(){
        var top=$(document).scrollTop();
        if(top>0){
            if($(".header").css("opacity")==1){
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
