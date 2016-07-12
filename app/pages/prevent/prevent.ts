import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {IncidentService} from "../../services/incident-service/incident-service";
import {LocationService} from "../../services/location-service/location-service";
import {PreventDetailPage} from "../prevent-detail/prevent-detail";
import app_config = require('../../globals');

@Component({
  templateUrl: 'build/pages/prevent/prevent.html'
})
export class PreventPage {
  incidents: any;
  origIncidents: any;

  constructor(private navController: NavController,
    private incidentService: IncidentService,
    private locationService: LocationService) {

    //this.searchQuery = '';
    this.loadIncidents();

  }


  loadIncidents(refresher=null) {
    let city = this.locationService.getCity();

    this.incidentService.getIncidentsByCity(city).subscribe(
      data => {
        this.origIncidents = JSON.parse(JSON.parse(JSON.stringify(data))._body).incidents;
        this.incidents = this.origIncidents;

        if(refresher)
          refresher.complete();

        if(app_config.is_debug)
          console.log(this.incidents);
      },
      error => console.log(error)
    );

  }


  getItems(ev) {
    this.incidents = this.origIncidents;

    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.incidents = this.incidents.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  viewDetail(event, inc) {
    this.navController.push(PreventDetailPage, {
      incident: inc
    });
  }

}
