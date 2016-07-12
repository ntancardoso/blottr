import {Storage, SqlStorage, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import {Incident} from '../../models/incident';
import {Disclose} from '../../models/disclose';
import {AccountService} from '../account-service/account-service';
import {Location} from '../../models/location';
import {LocationService} from '../../services/location-service/location-service'
import app_config = require('../../globals');


/**
 * Performs incident related services
 * 
 **/
@Injectable()
export class IncidentService {
  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  provinces: any;

  constructor(private http: Http, private events: Events,
    private accountService: AccountService,
    private locationService: LocationService) {

    this.getProvinces();
  }


  /**
    * List all incidents
    */
  getIncidentsByCity(city) {
    //TODO get incidents within the area
    return this.http.get(app_config.json_url + app_config.incident_map_filter + city);
  }


  /**
    * Disclose on Drupal backend
    * @param drupal formatted disclose model
    */
  disclose(discloseData) {
    this.http.post(app_config.api_url + app_config.incidents, JSON.stringify(discloseData), { headers: this.accountService.authHeaders(this.headers) }).subscribe(
      data => {
        console.log("disclose");

        if (app_config.is_debug)
          console.log(data);
        
        // Notify that disclose was saved
        this.events.publish("discloseSuccess");

      },
      error => {
        console.log("disclose error");
        if (app_config.is_debug)
          console.log(error);
      }
    );
  }


  /**
   * Return the code/name of the provinces
   * 
   */
  getProvinceFromJson() {
    return this.http.get("data/province.json");
  }


  /**
   * List all province from json file
   * 
   */
  getProvinces() {
    this.getProvinceFromJson().subscribe(
      data => {
        this.provinces = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log("error getting provinces");
        console.log(error);
      }
    );
  }



  /**
   * Reset Disclose model with default values
   * 
   */
  resetDisclose() {
    let disclose = new Disclose();
    let location = this.locationService.getCachedLocation();

    let currentDate = new Date();
    //Get ISO Date String with adjusted timezone
    disclose.when = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString();
    disclose.where_premise = location.premise;
    disclose.where_street = location.street;
    disclose.where_locality = location.neighborhood;
    disclose.where_city = location.city;
    disclose.where_province = "00";
    // Find province code
    for(let p in this.provinces) {
      if(this.provinces[p].name==location.province) {
        disclose.where_province = this.provinces[p].code;
        if(app_config.is_debug)
          console.log("Province found on list: "+disclose.where_province);
        break;
      }
      
    }

    disclose.where_lat = location.lat;
    disclose.where_lon = location.lon;
    disclose.how = "How It Happened: \n People Involved: \n Witnesses:";

    return disclose;
  }

}