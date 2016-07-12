import {Storage, SqlStorage, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Location} from '../../models/location';
import app_config = require('../../globals');


/**
 * Performs location service tasks
 * 
 **/
@Injectable()
export class LocationService {

  db: Storage = new Storage(SqlStorage);
  geocoder: google.maps.Geocoder = new google.maps.Geocoder();
  myLocation: Location;

  constructor(private http: Http,
    private events: Events) {

  }


  /**
    * Fetches the current location
    */
  refreshCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          if (app_config.is_debug)
            console.log("Current Location: " + pos.coords.latitude + ", " + pos.coords.longitude);
          this.myLocation = this.getAddress(pos.coords.latitude, pos.coords.longitude);
          this.events.publish("locationSuccess");
        },
        error => {
          console.log("error getting location");
        }
      );
    }
  }

  /**
    * Update the coordinates of the address provided
    * @param location
    */
  geocode(location: Location) {

    return Observable.create(observer => {
      let addr = "";
      if (location.premise)
        addr += location.premise + ", ";
      if (location.street)
        addr += location.street + ", ";
      if (location.neighborhood)
        addr += location.neighborhood + ", ";
      if (location.city)
        addr += location.city + ", ";
      if (location.province)
        addr += location.province + " ";


      if (this.geocoder) {
        this.geocoder.geocode({ 'address': addr }, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {

            if (results) {
              if (app_config.is_debug)
                console.log(JSON.stringify(results));

              let latLng = JSON.parse(JSON.stringify(results[0].geometry.location));

              location.lat = latLng.lat;
              location.lon = latLng.lng;

              if (app_config.is_debug) {
                console.log("lat " + latLng.lat);
                console.log("lng " + latLng.lng);
              }

              observer.next(location);
            } else {
              console.log("No results found");
            }
          } else {
            console.log("Geocoder failed due to: " + status);
          }
          observer.complete();
        });

      }
    }
    );

  }



  /**
    * Returns Location model containing the reverse geocoded address
    * @param latitude
    * @param longitude
    */
  getAddress(lat, lon) {

    let loc = new Location();
    loc.lat = lat;
    loc.lon = lon;

    if (this.geocoder) {
      let latlng = new google.maps.LatLng(lat, lon);
      this.geocoder.geocode({ 'location': latlng }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          //if (app_config.is_debug)
          //  console.log(JSON.stringify(results));

          if (results[1]) {
            for (var i = 0; i < results[0].address_components.length; i++) {
              for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                if (results[0].address_components[i].types[b] == "premise") {
                  loc.premise = results[0].address_components[i].long_name;
                } else if (results[0].address_components[i].types[b] == "route") {
                  loc.street = results[0].address_components[i].long_name;
                } else if (results[0].address_components[i].types[b] == "neighborhood") {
                  loc.neighborhood = results[0].address_components[i].long_name;
                } else if (results[0].address_components[i].types[b] == "locality") {
                  loc.city = results[0].address_components[i].long_name;
                } else if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  loc.province = results[0].address_components[i].long_name;
                } else if (results[0].address_components[i].types[b] == "country") {
                  loc.country = results[0].address_components[i].short_name;
                } else if (results[0].address_components[i].types[b] == "street_no") {
                  loc.street_no = results[0].address_components[i].long_name;
                }
              }
            }
          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });

    }
    return loc;
  }



  /**
    * Returns the last location value
    */
  getCachedLocation() {
    return this.myLocation;
  }


  /**
    * Returns the city
    */
  getCity() {
    if (this.myLocation)
      return this.myLocation.city;
    return null;
  }


  /**
    * Creates a map
    * @param the div id where map will be created
    */
  createMap(mapId: string) {

    let latLng = new google.maps.LatLng(this.myLocation.lat, this.myLocation.lon);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    let map = new google.maps.Map(document.getElementById(mapId), mapOptions);

    return map;
  }

  /**
 * Centers the map on the provided latitude and longitude
 * @param map
 * @param latitude
 * @param longitude
 **/
  centerMap(map, lat, lon) {
    map.setCenter(new google.maps.LatLng(lat, lon));
  }



  /**
    * Find nearby place types and create markers
    * @param place types https://developers.google.com/places/supported_types
    * @param custom marker icon
    */
  searchNearby(map, placeTypes, icon = null) {

    let infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: { lat: this.myLocation.lat, lng: this.myLocation.lon },
      radius: app_config.search_radius,
      types: placeTypes
    }, (results, status) => {
      console.log(status);
      console.log(results);

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {

          let marker = this.addMarker(map, results[i].geometry.location, icon);

          google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(results[i].name);
            infowindow.open(map, this);
          });
        }
      }

    });
  }


  /**
    * Add markers on the map
    * @param google.maps.Map position
    * @param google.maps.LatLng position
    * @param custom marker icon
    * @param custom marker title
    */
  addMarker(map: google.maps.Map, latLng, icon = null, title = null) {
    let marker = new google.maps.Marker({
      map: map,
      position: latLng
    });
    if (icon)
      marker.setIcon(icon);
    if (title)
      marker.setTitle(title);
    return marker;
  }
}