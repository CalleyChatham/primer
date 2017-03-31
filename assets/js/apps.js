//Create google map based on AJAX request to the Google API.  
//Given the lat/long pair provided by Google MAP API, a search call is triggered in the Eventful API with that value.
//Google map API Key: AIzaSyBab3Xg_CvWycB3_cR86ZpHIDgTR-aeM1I

//Passing Google Map coordinates To The Eventful API

//Now we make an API call to search for events within 2 miles from the latitude and longitude values we received in the step above. 
//We call the function ShowPosition to render that.

function showPosition(position) {
    var x = document.getElementById("location");
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    var latlon = position.coords.latitude + "," + position.coords.longitude;


    $.ajax({
      type:"GET",
      url:"http://api.eventful.com/json/events/search?apikey=sS23z3239cvjhmN3&latlong="+latlon,
      async:true,
      dataType: "json",
      success: function(json) {
                  console.log(json);
                  var e = document.getElementById("events");
                  e.innerHTML = json.page.totalElements + " events found.";
                  showEvents(json);
                  initMap(position, json);
               },
      error: function(xhr, status, err) {
                  console.log(err);
               }
    });

}

//Process The API Response

//After requesting Eventful API, we call function showEvents that processes the response and displays the event list. 
//Other function initMap initializes Google map and shows markers for events.

function showEvents(json) {
  for(var i=0; i<json.page.size; i++) {
    $("#events").append("<p>"+json._embedded.events[i].name+"</p>");
  }
}


function initMap(position, json) {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 10
  });
  for(var i=0; i<json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }
}

//During the map initialization, we use the addMarker function to add event markers to the map.
function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    map: map
  });
  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
  console.log(marker);
}