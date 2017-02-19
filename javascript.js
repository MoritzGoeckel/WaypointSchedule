$(document).ready(function(){

    //Show / Hide fields
    setInterval(function(){
        let oneShown = false;
            $("#waypoints input").each(function(i){
                if(this.placeholder != "Start" && this.value == "")
                {
                    if(oneShown == true)
                        $(this).hide();
                    else 
                    {
                        oneShown = true;        
                        $(this).show();
                    }
                }
            });
    }, 100);

});

function formatSeconds(sec){
        var date = new Date(null);
        date.setSeconds(sec);
        return date.toISOString().substr(11, 8);
    }

function getPath(start, waypoints) {
    var map = new google.maps.Map(document.getElementById('map'));

    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    let waypoints_processed = [];
    for(let i in waypoints)
        waypoints_processed.push({location:waypoints[i], stopover: true});

    var request = {
        destination: start,
        origin: start,
        waypoints: waypoints_processed,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
            
            let info = [];
            let html = "<h1>Route</h1>";
            let time = 0;
            for(let i in response.routes[0].legs)
            {
                let leg = response.routes[0].legs[i];
                console.log(leg);
                info.push({from:leg.start_address, to:leg.end_address, duration:leg.duration});
                html += "<span class='discr_item'><b>"+ formatSeconds(time) + "</b> - " +leg.start_address+"</span>";
                time += leg.duration.value;
            }

            html += "<span class='discr_item'><b>"+ formatSeconds(time) + "</b> - " +info[info.length - 1].to+"</span>";
            $("#discription").html(html);
        }
    });
}

function start(){
    var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0, lng: 0},
    zoom: 2
  });
}

function calcRoute() {
    let start = $("#start").val();
    let waypoints = [];
    $(".waypoint_input").each(function(){
        let val = $(this).val();
        if(val != "" && val != undefined && val != null)
            waypoints.push(val);
    });

    getPath(start, waypoints);
}