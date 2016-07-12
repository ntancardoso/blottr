import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {LocationService} from '../../services/location-service/location-service';
import {IncidentService} from '../../services/incident-service/incident-service';
import {Location} from '../../models/location';
import app_config = require('../../globals');

@Component({
  templateUrl: 'build/pages/alert/alert.html'
})
export class AlertPage {
  map: google.maps.Map;
  location: Location;

  constructor(private navController: NavController,
    private locationService: LocationService,
    private incidentService: IncidentService,
    private events: Events) {

    this.map = null;
    events.subscribe("locationSuccess", () => {
      this.location = locationService.getCachedLocation();

    });

  }


  /**
     * wait for everything to be ready before loading map
     *
    **/
  ngOnInit() {
    this.loadMap();
  }


  /**
     * Creates a map on div id "map"
     *
     */
  loadMap() {
    this.location = this.locationService.getCachedLocation();
    let latLng = new google.maps.LatLng(this.location.lat, this.location.lon);

    this.map = this.locationService.createMap("map");
    this.locationService.addMarker(this.map, latLng, app_config.me_icon, "Me");
  }





  distressCall() {
    let disclose = this.incidentService.resetDisclose();
    disclose.what = "Distress Call";
    this.incidentService.disclose(disclose.getData());

    //TODO send SMS

  }


  /**
   * Shows nearby places for safety
   **/
  toSafety() {
    if (this.map) {
      this.location = this.locationService.getCachedLocation();
      this.locationService.centerMap(this.map, this.location.lat, this.location.lon)
      this.locationService.searchNearby(this.map, app_config.search_types, app_config.search_icon);
    }

  }


  ionViewWillEnter() {
    //get location
  }

}
