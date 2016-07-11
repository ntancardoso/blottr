"use strict";

export var is_debug = true;

export var base_url = "http://dev-safecities.pantheonsite.io/";
export var api_endpoint = "ionic/"
export var api_url = base_url + api_endpoint;
export var json_url = base_url + "json/";
export var login = "user/login";
export var logout = "user/logout";
export var token = "user/token";
export var service_token = "services_token/generate"
//export var incidents = "incidents-list";    
export var incidents = "incidents";
export var incident_map_filter = "incidents-map?city_op=contains&city=";

/* Map settings */
export var search_radius = 2000;
export var search_types = ["police"];
export var search_icon = { url: '//maps.gstatic.com/mapfiles/ms2/micons/police.png' };
export var me_icon = {
    url: '//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
    size: new google.maps.Size(22, 22),
    origin: new google.maps.Point(0, 18),
    anchor: new google.maps.Point(11, 11)
}