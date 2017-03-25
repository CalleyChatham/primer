console.log('App is running');
$(document).ready(function() {
    //sS23z3239cvjhmN3 - key for eventful

    $("#search-events").on("click", function() {

        event.preventDefault();

        var appKey = "sS23z3239cvjhmN3"; //prasanth's app key for eventful
        var location = $("#location-request").val(); //currently our text box prompts for an address.   i believe address is not allowed, but rather we can pass in a combo of - city, state, country; zip code; venue ID; geocoordinates.  so we should probably fix our textbox to match this eventually
        var categories = "music"; //place for categories to search.  eventually will be pulling this from the categories list box.   multiple categories will have to be separated by commas
        var startDate = "20170301"; //place holder for start date.  eventually will be pulling tihs from the start date field.  we will also have to convert to the following format yyyymmdd00
        var endDate = "20170401"; //place holder for end date.  eventually will be pulling tihs from the end date field.  we will also have to convert to the following format yyyymmdd00
        // var dateConcatenated = startDate + "-" + endDate; //this is the format that date parameter will have to be put in to pass to api (yyyymmdd00-yyyymmdd-00)
        var dateConcatenated = startDate;
        var radius = 2; //place holder for miles around address that we want to search.  eventually will be pulling from the miles around drop down box.
        var resultSize = 100; //place holder for results that you want to return from the web service.  eventually will be pulling from the results drop down box.
        var dropValue = $("#category-select").val();;

        console.log('Search Location ' + location);
        console.log('Search Category ' + categories);
        console.log('Dropdown Value ' + dropValue);
        console.log('Date ' + dateConcatenated);
        console.log('Radius ' + radius);
        console.log('Number of results ' + resultSize);
        console.log('---------------------');


        //this is the ideal ajax call, but not working so switching to use the call below instead
        //var queryURL = "http://api.eventful.com/json/events/search?location=San+Diego&app_key=sS23z3239cvjhmN3&date=future&page_size=5";

        // $.ajax({
        //     url:  "http://api.eventful.com/json/events/search?location=San+Diego&app_key=sS23z3239cvjhmN3&date=future&page_size=5",
        //     method: "GET"          
        //   })
        //   .done(function(response) {
        //     //var results = response.data;
        //     console.log('results');
        //   });

        //here is the EVDB API call that does work.   the secret sauce to having this working is the inclusion of the script tag below in the index.html page
        //<script type="text/javascript" src="http://api.eventful.com/js/api"></script> -->secret sauce for EVDB.   won't work without including this above our app.js include
        var oArgs = {
            app_key: appKey,
            location: location,
            category: categories,
            "date": dateConcatenated,
            within: radius,
            //"include": "tags,categories",
            page_size: resultSize,
            sort_order: "popularity", //options are date, popularity and relevance
            sort_direction: "descending" //return most recent dates first
        };
        EVDB.API.call("/events/search", oArgs, function(oData) {
            var results = oData;
            var $event = $(results.events.event);
            var $div = $('<div>');

            console.log('API CALL RESULTS');
            console.log(results);

            // console.log($event.length);
            for (var i = 0; i < $event.length; i++) {
                console.log('Venue Name  ' + $event[i].venue_name);
                console.log('Description  ' + $event[i].venue_address);
                $('.event-name').text($event[i].title);
                $('.venue-name').text($event[i].venue_name);
                $('.venue-address').text($event[i].venue_address);
                $('.venue-address').text($event[i].venue_address);
                
                $('#list-detail').append($div);

                //need this to call API and get event information
                var eventId = $event[i].id;
                var eArgs = {
                    app_key: appKey,
                    id: eventId
                };
                EVDB.API.call("/events/get", eArgs, function(oData) {
                    var eventinfo = oData;
                    var eventTitle = eventinfo.title;
                });

                var dateStartTime = $event[i].start_time;
                var venueName = $event[i].venue_name;

                //need API call here to get venue info outside of name
                var venueId = $event[i].venue_id;
                var vArgs = {
                    app_key: appKey,
                    id: venueId
                };
                EVDB.API.call("/venues/get", vArgs, function(oData) {
                    var venueinfo = oData;
                    var venueAddress = venueinfo.address;
                    var venueCity = venueinfo.city;
                    var venueState = venueinfo.region_abbr;
                    var venueCountry = venueinfo.country_abbr;
                });



                var eventUrl = $event[i].url;
                var eventDesc = $event[i].description;
                // var eventImage = $event[i].image.url;
                // console.log(eventImage);

                /*
                      need to attach all the info gathered to the div tags.   can you guys take care of this in class today?
                      also the title should probably be made to be a link passing the event ID somehow to the event detail page
                      one other thing probably to eventually keep in mind after we get the information to post is to maybe push all
                      event and venue information for a search into an array of objects.  this is so we dont have to keep calling the API.
                      this is a much lower priority though i think
                  */
            }
        });





    });

});
