$(document).ready(function(){
    $(".inner-slide-container").each(function(i,e){
        var children=$(e).children();
        /*if(i%2==0)
            children[1].parentNode.insertBefore(children[1],children[0]);*/
        children=$(e).children();
        for(i=0;i<children.length;i++){
            $(children[i]).css("left","-"+(25.125*(i))+"%");
        }
    });
    fitCards();
    $(window).resize(fitCards)
});

function fitCards(){
    var width=$("#content-box").width();
    var cardWidth=$(document.getElementsByClassName("card")[0]).width();
    var numCards=Math.floor(width/cardWidth);
    var margin=(width%cardWidth)/(numCards+1);
    if(margin<15){
        margin=(width%cardWidth+cardWidth)/(numCards);
        numCards--;
    }
    if(width<635){
        margin=($(window).width()-151-cardWidth)/2;
    }
    var cards=document.getElementsByClassName("card");
    for(i=0;i<cards.length;i++){
        $(cards[i]).css("margin","10px "+(margin/2)+"px");
        if(i%numCards==0)
            $(cards[i]).css("margin-left",margin+"px");
        if(i%numCards==numCards-1)
            $(cards[i]).css("margin-right",margin+"px");
    }
    console.log(width+" "+cardWidth);
}