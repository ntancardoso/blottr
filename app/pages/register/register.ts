import {Component} from '@angular/core';
import {NavController, Events, ViewController} from 'ionic-angular';
import {FormBuilder, Validators} from "@angular/common";
import {Account} from '../../models/account';
import {AccountService} from '../../services/account-service/account-service';

@Component({
  templateUrl: 'build/pages/register/register.html'
})
export class RegisterPage {
  account: Account;
  registerForm: any;
  constructor(private navController: NavController,
    private viewController: ViewController,
    formBuilder: FormBuilder,
    events: Events,
    private accountServices: AccountService) {


    // Setup validation
    this.account = new Account();
    this.registerForm = formBuilder.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      contact_no: ["", Validators.required]
    });

    events.subscribe("registerSuccess", () => {
      this.viewController.dismiss({ "success": true });
    });

    localStorage.clear();
  }


  /**
    * Register new user
    */
  register() {
    console.log("Register account");
    this.account.error = "";
    this.accountServices.createAccount(this.account);
  }

  /**
    * Cancel
    */
  cancel() {
    console.log("Cancel Sign Up");
    this.viewController.dismiss({ "cancel": false });
  }
}
