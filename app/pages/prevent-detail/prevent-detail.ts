import {Component} from '@angular/core';
import {NavController, NavParams, Events} from 'ionic-angular';
import {LocationService} from '../../services/location-service/location-service';
import {IncidentService} from '../../services/incident-service/incident-service';
import {Location} from '../../models/location';
import {Incident} from '../../models/incident';
import app_config = require('../../globals');

@Component({
  templateUrl: 'build/pages/prevent-detail/prevent-detail.html'
})
export class PreventDetailPage {
  map: google.maps.Map;
  incident: Incident;

  constructor(private navController: NavController,
    private locationService: LocationService,
    private incidentService: IncidentService,
    private events: Events,
    navParams: NavParams) {

    this.map = null;
    this.incident = navParams.get('incident');

  }


  /**
     * wait for everything to be ready before loading map
     *
    **/
  ngOnInit() {
    if(app_config.is_debug)
      console.log("Load map");
    this.loadMap();
  }


  /**
     * Creates a map 
     *
     */
  loadMap() {
    if(this.incident && this.incident.latitude>0 && this.incident.longitude>0) {
      let latLng = new google.maps.LatLng(this.incident.latitude, this.incident.longitude);

    this.map = this.locationService.createMap("incidentmap");
    this.locationService.centerMap(this.map, this.incident.latitude, this.incident.longitude);
    this.locationService.addMarker(this.map, latLng, app_config.prevent_icon, "Incident");

    }
    
  }





}
