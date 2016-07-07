//import {Storage, SqlStorage} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import {Incident} from '../../models/incident';
import app_config = require('../../globals');


@Injectable()
export class IncidentService {
  http: Http;
  headers: Headers =  new Headers({ 'Content-Type': 'application/json'});

  constructor(http: Http) {
    this.http = http;
  }


  getIncidents() {
    return this.http.get(app_config.api_url+app_config.incidents);
  }

  disclose(discloseData) {
    this.checkHeaders();
    this.http.post(app_config.api_url+app_config.incidents,JSON.stringify(discloseData),{ headers: this.headers }).subscribe(
      data => {
        console.log("disclose");
        console.log(data);

      },
      error => {
        console.log("disclose error");
        console.log(error);
      }
    );
  }

  checkHeaders() {
    if(localStorage.getItem("token")!==undefined && localStorage.getItem("token")!="")
      this.headers.set('X-CSRF-Token',localStorage.getItem("token"));
    if(localStorage.getItem("cookie")!==undefined && localStorage.getItem("cookie")!="")
      this.headers.set('Authorization',localStorage.getItem("cookie"));
  }

}