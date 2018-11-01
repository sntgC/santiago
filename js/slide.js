$(document).ready(function(){
    $(".inner-slide-container").each(function(i,e){
        var children=$(e).children();
        /*if(i%2==0)
            children[1].parentNode.insertBefore(children[1],children[0]);*/
        children=$(e).children();
        for(i=0;i<children.length;i++){
            $(children[i]).css("left","-"+(25.125*(i))+"%");
            console.log($(children[i]).css("left"));
        }
    });
});