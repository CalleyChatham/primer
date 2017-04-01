console.log('App is running');
$(document).ready(function() {
    //sS23z3239cvjhmN3 - key for eventful

    var appKey = "sS23z3239cvjhmN3"; //prasanth's app key for eventful
    var nodeId = "";

    var config = {
    apiKey: "AIzaSyBwxOCXyFWRo8vRnYhHn5jRqVARLZuuueU",
    authDomain: "primer-c6531.firebaseapp.com",
    databaseURL: "https://primer-c6531.firebaseio.com",
    storageBucket: "primer-c6531.appspot.com",
    messagingSenderId: "735582248365"
    };
    
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    var starAscii = "&#9734;";
    var lastObj = [];
    var idList = [];
    var lastKey;




    //This function sets the body id to "results" in order to display the results div 
    function goToResults(){
        $('body').attr('id','results');
    }

    $( function() {
      $( "#start-date" ).datepicker();
    });

    $( function() {
      $( "#end-date" ).datepicker();
    });

    //function to get event details
    function getEventDetails(eventId){
        console.log(eventId);
        //Log the event ID to the console
        //When this function is trigerred set the body id to full in order to switch the full "detailed" view
        $('body').attr('id','full');
        //empty the event-detail container
        $('#event-details').empty();
        //empty the event-image container
        $('#event-image').empty();

        //Need this to call API and get event information
        var eArgs = {
            app_key: appKey,
            id: eventId
        };
        EVDB.API.call("/events/get", eArgs, function(oData) {
            var eventinfo = oData;

            nodeId.set({
               // set the results data for the current firebase node
                eventinfo
            }); // end nodeId.set block



            //Variables for the differentl data elements
            var eventTitle = '<h2>' + eventinfo.title +'</h2>';
            var eventAddress = '<div>' + eventinfo.address +'</div>';
            var eventVenue = '<div>' + eventinfo.venue_name +'</div>';
            var eventCity = '<div>' + eventinfo.city+', '+eventinfo.region + '</div>';
            if(eventinfo.description){
                var eventDescription = '<div><h3>Description</h3>' + eventinfo.description +'</div>';
            }
            var eventURL = '<a href="'+eventinfo.url+'" target="_blank" class="more-info">'+ 'More info' +'</a>';
            
            //We'll probably end up not using the event image... TBD
            var $eventImage = $("<img>");
            //var eventImageURL = eventinfo.images.image[0].medium.url;
            


            //set map address
            var googleApiID = 'AIzaSyBab3Xg_CvWycB3_cR86ZpHIDgTR-aeM1I';
            var googleAddressURL = 'https://www.google.com/maps/embed/v1/place?key='+googleApiID+'&q='+ eventinfo.address;
            $('#embedded-map').attr('src',googleAddressURL);

            //get directiosn link
            var getDirectionsURL = 'http://maps.google.com/maps?f=d&source=s_d&saddr=&daddr='+ eventinfo.address;
            $('.get-directions').attr('href',getDirectionsURL);


            //Create a back to results link
            var $resultsLink =  $('<a />', {
                    //id : $event[i].id,
                    //name : "link",
                    href : '', //$event[i].title,
                    class: 'back-to-results',
                    text : 'Back to results',
                    //on click prevent the detault, use the gotoResults function
                    click : ( function(e) {e.preventDefault(); goToResults(); return false; } )
                });



            //console.log(eventImageURL);
            //$eventImage.attr("src", eventImageURL);


            // now append each search result to the results div, in the process, creating favorites buttons tagged with data attributes storing the related search key, search result number, and event ID
            // var $eventFavorite = $("<button>");
            // $eventFavorite.attr('type', 'buton');
            // $eventFavorite.attr('data-key', lastKey);
            // $eventFavorite.attr('data-num', 0);
            // $eventFavorite.attr('data-eventID', eventinfo.id);
            // $eventFavorite.attr('class', 'favs');
            // $eventFavorite.text(starAscii);



            //Variable for the event date string
            var eventDate = '<div id="event-date">'+ moment(eventinfo.start_time).format("dddd, MMMM Do YYYY, h:mm a") +'<div>';
            

            console.log(eventinfo);
            //populates the event details - full event description
            //$('#event-details').append($eventFavorite);
            $('#event-details').append($resultsLink);
            $('#event-details').append(eventTitle);
            $('#event-details').append(eventDate);
            $('#event-details').append(eventVenue);
            $('#event-details').append(eventAddress);
            $('#event-details').append(eventCity);
            $('#event-details').append(eventURL);
            $('#event-details').append(eventDescription);
            //$('#event-image').append($eventImage);

            

        });
    }

getDBData();
function getDBData(){
    // Firebase watcher + initial loader fires on any changes to a "value" in the database
    database.ref().child('/searches').on("value", function(snapshot) {

        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        
        // Getting an array of each key in the snapshot object
        var svArr = Object.keys(sv);
        
        // Finding the key for the last search
        var lastIndex = svArr.length - 1;
        lastKey = svArr[lastIndex];

        console.log(svArr);
        
        // Using the key for the last search to access the last added search object
        lastObj = sv[lastKey];

                    
        // this retrieves the favorites list and displays it in the favorites div
        database.ref().child('/favEvents').once("value", function(snapshot) {
            var favList = snapshot.val();
            $("#favorites").html("");
            // check to make sure that the /favEvents branch exists
            if (favList) {        
                var favlistArr = Object.keys(favList);
                idList = [];
              
                // then loop through the list of search keys in the favorites list.  Each key here matches the node key for the related search in the /searches branch of the firebase database
                for (var i=0; i < favlistArr.length; i++ ) {
                    // retrieve the search results object corresponding to this search key
                    var currObj = favList[favlistArr[i]];
                    console.log(currObj);
                    // retrieve the favorites object corresponding to this search key
                    var numObj = favList[favlistArr[i]]; 
                    // push the event ID to the idList array
                    idList.push(favlistArr[i]);
                    //if this eventID is already a favorite
                    if (idList.indexOf(favlistArr[i]) > -1) {
                        // set the star to filled
                        starAscii = "&#9733;";
                    } else { 
                        // set the star to outlined
                        starAscii = "&#9734;";
                    } // end if/else// end if this eventID is already a favorite
                    // now prepend each favorite event from the favorites list, including the star button to allow unfavoriting from the favorites div
                    $("#favorites").prepend(currObj.title  + " at " + currObj.venue_name + " in " + currObj.city_name + "<br>Date & Time: "  + currObj.start_time + "<button type='button' data-key=" + currObj.search_key +  " data-num=" + currObj.result_num + " data-eventID=" + favlistArr[i] + " class='favs' style='background-color:white; border:none'>" + starAscii + "</button><br><br>");
                } // end searches for loop
            } // end if favList exists
        }); // end favorites snapshot function 

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }); // end firebase watcher
}
























    $("#search-events").on("click", function() {
        //Check if location input has something in there
        if (!$('#location-request').val()) {
            $('#errorModal').modal('show');
        } else {
            //The Stuff
            $('#spinner').css('display','block');
            var location = $("#location-request").val(); //currently our text box prompts for an address.   i believe address is not allowed, but rather we can pass in a combo of - city, state, country; zip code; venue ID; geocoordinates.  so we should probably fix our textbox to match this eventually
            var categories = $("#category-select").val(); //place for categories to search.  eventually will be pulling this from the categories list box.   multiple categories will have to be separated by commas

            event.preventDefault();
            $('#list-details').empty();
            $('body').attr('id','results');
            $('body').attr('class',categories);

            // var startDate = "20170301"; //place holder for start date.  eventually will be pulling tihs from the start date field.  we will also have to convert to the following format yyyymmdd00
            // var endDate = "20170401"; //place holder for end date.  eventually will be pulling tihs from the end date field.  we will also have to convert to the following format yyyymmdd00

            var startDate = moment($("#start-date").val()).format("YYYYMMDD") + "00";
            var endDate = moment($("#end-date").val()).format("YYYYMMDD") + "00";
           
            //this is the format that date parameter will have to be put in to pass to api (yyyymmdd00-yyyymmdd-00)
            var dateConcatenated = startDate + "-" + endDate;
            var radius = 5; //place holder for miles around address that we want to search.  eventually will be pulling from the miles around drop down box.
            var resultSize = 20; //place holder for results that you want to return from the web service.  eventually will be pulling from the results drop down box.
            

            // weather
            function weatherCheck(){

                $.ajax({ url: "http://api.openweathermap.org/data/2.5/weather?q="+location+"&appid=9e89a078dc94549dc6adf54fa09c6b24&units=imperial"} ).done(function( data ) {
                  var currentConditions = data.weather[0].main;
                  var currentTemp = data.main.temp+' '+'<span class="the-f">&#x2109;</span>';
                  console.log('---------------------');
                  console.log('Weather data');
                  console.log(currentConditions, currentTemp);
                  console.log(data);
                  console.log('---------------------');
                 
                  $('#current-temp').html(currentTemp);
                  $('#current-conditions').html(currentConditions);

                });
              };
            weatherCheck();
            // weather

        

            //Create an empty firebase node to store the search results
            nodeId = firebase.database().ref().child('/searches').push();


            console.log('Search Location ' + location);
            console.log('Search Category ' + categories);
            console.log('Date ' + dateConcatenated);
            console.log('Radius ' + radius);
            console.log('Number of results ' + resultSize);
            console.log('---------------------');


            //here is the EVDB API call that does work.   the secret sauce to having this working is the inclusion of the script tag below in the index.html page
            //<script type="text/javascript" src="http://api.eventful.com/js/api"></script> -->secret sauce for EVDB.   won't work without including this above our app.js include
            var oArgs = {
                app_key: appKey,
                location: location,
                category: categories,
                "date": dateConcatenated,
                within: radius,
                // "include": "tags,categories",
                page_size: resultSize,
                sort_order: "relevance", //options are date, popularity and relevance
                sort_direction: "descending" //return most recent dates first
            };
            console.log(oArgs.app_key,oArgs.location,oArgs.category,oArgs.within,oArgs.sort_order,oArgs.sort_direction);

            EVDB.API.call("/events/search", oArgs, function(oData) {
                $('#spinner').css('display','none');
       
                var results = oData;
                var $event = $(results.events.event);
                var $div = $('<div>');

                console.log(oArgs);
                console.log('API CALL RESULTS');
                console.log(results);

                // console.log($event.length);
                for (var i = 0; i < $event.length; i++) {
                    console.log('Event Name  '+i+' '+ $event[i].title);

                    var $eventLink =  $("<a />", {
                            id : $event[i].id,
                            //name : "link",
                            href : '', //$event[i].title,
                            text : $event[i].title,
                            click : ( function(e) {e.preventDefault(); getEventDetails(this.id); return false; } )
                        });

                    var $eventName = $("<h2>");
                    $eventName.prepend($eventLink);


                    var eventVenue = '<div>'+$event[i].venue_name+'<div>';
                    var eventAddress = '<div>'+$event[i].venue_address+'<div>';
                    var eventCity = '<div>'+ $event[i].city_name +' '+ $event[i].region_name +', '+ $event[i].country_abbr+'<div>';
                    var eventDate = '<div>'+ moment($event[i].start_time).format("dddd, MMMM Do YYYY, h:mm a") +'<div>';
                    //moment($event[i].venue_address).format("dddd, MMMM Do YYYY, h:mm:ss a");

                    $('#list-details').append($eventName);
                    $('#list-details').append(eventDate);
                    $('#list-details').append(eventVenue);
                    $('#list-details').append(eventAddress);
                    $('#list-details').append(eventCity);
                }
            });

            //The Stuff
        }
        //Check if location input has a value
    });
});
