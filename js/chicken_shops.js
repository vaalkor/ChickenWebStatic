"use strict"

$(document).ready(onPageReady);

function onPageReady()
{
    //Make an ajax call to the server requesting the information of all the chicken shops...
    $.ajax({
        url: '/ajax',
        data: {"requestType": "chicken_shops"},
        contentType: 'application/json',
        success: result
    });
    
    function result(response){
        console.log("hello there!")
        console.log(response.data);
        console.log(response.data.length);
        response.data.forEach(appendLoop);
        function appendLoop(element){
            $('#main_content').append(makeChickenBox(element.id, element.name, element.address, Math.round(element.rating))) ;
        }
        var chicken_boxes = $(".chicken_shop_box");
        if(chicken_boxes.length>0)
            chicken_boxes.on("click", onChickenBoxClicked);
    }
}

function onChickenBoxClicked(){
    var shopid = $(this).attr("shopID");
    window.location.href = window.location.href.split(window.location.pathname)[0] + "/shop_page.html?shopid="+shopid.toString();   
}

function makeChickenBox(shopID, name, address, rating)
{
    //return("<div class=\"chicken_shop_box\" shopID=\""+shopID.toString()+"\"> <h1>"+name+"</h1><hr/><p>"+address+"</p></div>");
    var returnHTML = "<div class=\"chicken_shop_box\" shopID=\""+shopID.toString()+"\">" + 
                        "<h1>"+name+"</h1>"        +
                     "<hr/>"  +
                     "<div class=\"stars\">";
    for(var i=0;i<5;i++)
    {
        if(i<rating)
            returnHTML += "<img type=\"image/svg+xml\" class=\"star\" value=\"1\" src=\"images/star_gold.svg\" >" +
                           "</img>";
        else
            returnHTML += "<img type=\"image/svg+xml\" class=\"star\" value=\"1\" src=\"images/star.svg\" >" +
                           "</img>";
    }
    returnHTML += "</div>" +
                    "<hr/>"  +
                    "<h4>" + address + "</h4>" +
                    "</div>";

    return(returnHTML);
}