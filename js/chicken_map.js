"use strict";
//function makeI

var map;

function initMap() {

	var icon = {
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

	$.ajax({
        url: '/ajax',
        data: {"requestType": "chicken_shops"},
        contentType: 'application/json',
        success: onGetChickenShops
    });
    
    function onGetChickenShops(response)
    {
        console.log("hello there!")
        console.log(response.data);
        console.log(response.data.length);

        response.data.forEach(markerLoop);

        function markerLoop(chickenShop)
        {
        	console.log("lat: ",chickenShop.latitude, ".. lng: ", chickenShop.longitude );
        	var position = {lat: chickenShop.latitude , lng: chickenShop.longitude};
            var marker = new google.maps.Marker({
	          position: position,
	          map: map,
	          icon: icon,
	        });

	        attachInfoWindow(marker, chickenShop);
        }

    }

    function attachInfoWindow(marker, chickenShop) {
	  var infoWindow = new google.maps.InfoWindow({
	    content: '<div id="content">'+
				      '<div id="siteNotice">'+
				      '</div>'+
				      '<h1 id="firstHeading" class="firstHeading">' + chickenShop.name + '</h1>'+
				      '<div id="bodyContent">'+
				      '<p>' + chickenShop.address + '</p>' +
				      '<p><a href=" ' + window.location.href.split(window.location.pathname)[0] + "/shop_page.html?shopid="+ chickenShop.id.toString()+' ">'+
				      'Visit shop page.</a></p> '+
				      '</div>'+
			      '</div>'
	  });

	  marker.addListener('click', function() {
	    infoWindow.open(marker.get('map'), marker);
	  });

	  google.maps.event.addListener(map, 'click', function() {
	        infoWindow.close();
	    });
	}

  }



console.log("sidufnskdjnf");