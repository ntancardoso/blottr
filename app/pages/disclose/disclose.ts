import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/common";
import {NavController, Events, Alert} from 'ionic-angular';
import {Disclose} from '../../models/disclose';
import {Location} from '../../models/location';
import {IncidentService} from '../../services/incident-service/incident-service'
import {LocationService} from '../../services/location-service/location-service'
import app_config = require('../../globals');


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
  location: Location;
  provinces: any;

  constructor(private navController: NavController,
    private incidentService: IncidentService,
    private locationService: LocationService,
    formBuilder: FormBuilder,
    events: Events) {

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



    events.subscribe("discloseSuccess", () => {
      let alert = Alert.create({
        subTitle: 'Saved',
        buttons: ['OK']
      });
      this.navController.present(alert);
      this.resetDisclose();
    });

    this.resetDisclose();
    this.getProvinces();

  }


  submit() {
    this.incidentService.disclose(this.disclose.getData());
  }


  resetDisclose() {
    this.disclose = this.incidentService.resetDisclose();

  }

  getProvinces() {
    this.incidentService.getProvinceFromJson().subscribe(
      data => {
        this.provinces = JSON.parse(JSON.parse(JSON.stringify(data))._body);
      },
      error => {
        console.log("error getting provinces");
        console.log(error);
      }
    );
  }


}
