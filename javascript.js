$(document).ready(function(){

});

function start(){

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
                let html = "";
                let time = 0;
                for(let i in response.routes[0].legs)
                {
                    let leg = response.routes[0].legs[i];
                    console.log(leg);
                    info.push({from:leg.start_address, to:leg.end_address, duration:leg.duration});
                    html += "<span class='discr_item'>"+ formatSeconds(time) + " > " +leg.start_address+"</span>";
                    time += leg.duration.value;
                }

                html += "<span class='discr_item'>"+ formatSeconds(time) + " > " +info[info.length - 1].to+"</span>";

                console.log(info);
                $("#discription").html(html);
            }
        });
    }

    getPath("Zuckerbergstr. 104 70378 Stuttgart", ["Kandlgasse 30 Wien", "Weserstrasse 3 Stuttgart", "Charlottenplatz Stuttgart"]);
}