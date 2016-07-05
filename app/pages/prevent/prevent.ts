import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {IncidentService} from "../../services/incident-service/incident-service";

@Component({
  templateUrl: 'build/pages/prevent/prevent.html'
})
export class PreventPage {
  incidents: any;
  origIncidents: any;

  constructor(private navController: NavController,
    private incidentService: IncidentService) {
      
      //this.searchQuery = '';
      this.loadIncidents();

  }

  loadIncidents() {
    this.incidentService.getIncidents().subscribe(
      data => {
        this.origIncidents = JSON.parse(JSON.parse(JSON.stringify(data))._body);
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
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
