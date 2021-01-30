"use strict"

$(document).ready(onPageReady);

var mapLoaded = false;
var ajaxRecieved = false;

var chickenShopInfo;
var map;
var icon;
var shopID;

var starRating = 0;
var starsObject;
var reviewStars;

function centerAndZoomMap(){
    console.log("mapLoaded: ", mapLoaded, "... ajaxRecieved: ", ajaxRecieved);
    console.log(chickenShopInfo);
    if(mapLoaded && ajaxRecieved){
        var position = {lat: chickenShopInfo.latitude , lng: chickenShopInfo.longitude};
        map.setCenter(position);
        map.setZoom(17);

        var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: icon,
        });

    }
}

function initMap(){
    icon = {
        url: "../images/chickenmarker.png", // url
        scaledSize: new google.maps.Size(62, 30), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var bristol = {lat: 51.454513 , lng: -2.587910};

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: bristol
    });

    mapLoaded = true;
    centerAndZoomMap()
}

function onSubmitButtonClicked(){
    var name = document.getElementById('reviewer_name').value;
    var review_text = document.getElementById('review_text').value;
    //alert(name=="");
    //alert("name: "+name+".. text: '" + review_text);
    if(starRating == 0)
    {
        alert("Give the shop a rating out of 5 stars!");
    }
    else if(name != "" && review_text != "")
    {
        alert("Thank you for your review. Have a splendid day");
        $.ajax({
            url: '/ajax',
            data: {"requesttype": "submit_review", "shopid": shopID, "poster" : name, "review_text" : review_text, "stars": starRating},
            contentType: 'application/json',
            success: null
        });

        $('#shop_reviews').append(makeChickenBox(name, review_text, starRating));
    }
    
}

function onPageReady()
{
    document.getElementById('submit_button').onclick = onSubmitButtonClicked;
    //I KNOW I KNOW THIS CODE IS ALL HORRIBLE, BUT IM GOING TO GET IT WORKING AND THEN FUCKING CLEAN IT UP ALRIGHT? FAAACK OFF....
    console.log(window.location.href);
    var splitURL = document.URL.split("?");
    console.log(splitURL);

    if(splitURL.length>1){
        var parsedQuery = parseQuery(document.URL);
        console.log("alright mate");

        if(parsedQuery.shopid){
            shopID = parsedQuery.shopid;
            $.ajax({
                url: '/ajax',
                data: {"requesttype": "shop_info", "shopid": parsedQuery.shopid},
                contentType: 'application/json',
                success: shopInfoCallback
            });
            $.ajax({
                url: '/ajax',
                data: {"requesttype": "shop_reviews", "shopid": parsedQuery.shopid},
                contentType: 'application/json',
                success: appendReviewsCallback
            });        

        }
    }

    function shopInfoCallback(response){
        document.getElementById("shop_address").innerHTML = response.data[0].address;
        document.getElementById("shop_name").innerHTML = response.data[0].name;

        ajaxRecieved = true;
        chickenShopInfo = response.data[0];

        centerAndZoomMap();        
    }
    
    function appendReviewsCallback(response){
        console.log("hello there!")
        console.log(response.data);
        console.log(response.data.length);
        response.data.forEach(appendLoop);
        function appendLoop(element){
            $('#shop_reviews').append(makeChickenBox( element.poster, element.review_text, element.stars)) ;
        }
    }

    reviewStars = document.querySelectorAll(" #stars img ");
    for(var i=0; i<reviewStars.length; i++)
        reviewStars[i].onclick = reviewStarClick;

    reviewStars

}

function reviewStarClick(event){
    starRating = parseInt( event.target.getAttribute("alt") ) ;
    for(var i=0;i<reviewStars.length;i++)
    {
        if(i < starRating)
            reviewStars[i].setAttribute("src", "images/star_gold.svg");
        else   
            reviewStars[i].setAttribute("src", "images/star.svg");

    }
    //alert(starRating);
}

function makeReviewBox( poster, reviewText, rating)
{
    return("<div class=\"chicken_shop_box\"> <h3>"+poster+":rat: "+rating+"</h3><hr/><h4>"+reviewText+"</h4></div>");
}

function makeChickenBox(name, text, rating)
{
    //return("<div class=\"chicken_shop_box\" shopID=\""+shopID.toString()+"\"> <h1>"+name+"</h1><hr/><p>"+address+"</p></div>");
    var returnHTML = "<div class=\"chicken_shop_box\" "+shopID.toString()+"\">" + 
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
                    "<h4>" + text + "</h4>" +
                    "</div>";

    return(returnHTML);
}


