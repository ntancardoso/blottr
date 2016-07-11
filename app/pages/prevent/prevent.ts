import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {IncidentService} from "../../services/incident-service/incident-service";
import {LocationService} from "../../services/location-service/location-service";

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

  loadIncidents() {
    let city = this.locationService.getCity();

    this.incidentService.getIncidents(city).subscribe(
      data => {
        this.origIncidents = JSON.parse(JSON.parse(JSON.stringify(data))._body).incidents;
        this.incidents = this.origIncidents;
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
        return (item.incident.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
