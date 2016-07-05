//import {Storage, SqlStorage} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import {Incident} from '../../models/incident';
import myGlobals = require('../../globals');


@Injectable()
export class IncidentService {
  http: Http;

  constructor(http: Http) {
    this.http = http;
  }


  getIncidents() {
    return this.http.get(myGlobals.api_url+myGlobals.incidents);
  }

  saveIncident(incident:Incident) {

  }

}