import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/common";
import {NavController} from 'ionic-angular';
import {Disclose} from '../../models/disclose';
import {IncidentService} from '../../services/incident-service/incident-service'


/**
 *  Page to report incidents
 * 
 */
@Component({
  templateUrl: 'build/pages/disclose/disclose.html'
})
export class DisclosePage {
  discloseForm: any;
  disclose: Disclose;
  provinces: any;


  constructor(private navController: NavController,
    private incidentService: IncidentService,
    formBuilder: FormBuilder) {

    this.disclose = new Disclose();

    // Setup form validation
    this.discloseForm = formBuilder.group({
      what: ["", Validators.required],
      how: ["", Validators.required],
      when: ["", Validators.required],
      where_street: ["", Validators.required],
      where_locality: ["", Validators.required],
      where_city: ["", Validators.required],
      where_province: ["", Validators.required]
    });

    //TODO set from current location. 
    //Currently default to MM
    this.disclose.where_province = "00";

    // Setup province list
    incidentService.getProvince().subscribe(
      data => {
        this.provinces = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log("error getting provinces");
        console.log(error);
      }
    );

  }

  submit() {
    this.disclose.where_lat = "14.572942";
    this.disclose.where_lon = "121.049045";
    this.incidentService.disclose(this.disclose.getData());
  }


}
