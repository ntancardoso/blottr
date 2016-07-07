import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/common";
import {NavController} from 'ionic-angular';
import {Disclose} from '../../models/disclose';
import {IncidentService} from '../../services/incident-service/incident-service'


@Component({
  templateUrl: 'build/pages/disclose/disclose.html'
})
export class DisclosePage {
  discloseForm: any;
  disclose: Disclose;

  constructor(private navController: NavController,
    private incidentService: IncidentService,
    formBuilder: FormBuilder) {

    this.disclose = new Disclose();
    this.discloseForm = formBuilder.group({
      what: ["", Validators.required],
      how: ["", Validators.required],
      when: ["", Validators.required],
      where_street: ["", Validators.required],
      where_locality: ["", Validators.required],
      where_city: ["", Validators.required],
      where_province: ["", Validators.required]
    });

  }


  submit() {
    console.log(this.disclose.getData());
    this.incidentService.disclose(this.disclose.getData());
  }


}
