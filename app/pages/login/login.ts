import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/common";
import {NavController, ViewController,  Events} from 'ionic-angular';
import {Account} from '../../models/account';
import {AccountService} from '../../services/account-service/account-service';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  account: Account;
  loginForm: any;

  constructor(private navController: NavController,
    private viewController: ViewController,
    formBuilder: FormBuilder,
    events: Events,
    private accountServices: AccountService) {

    this.account = new Account();
    this.loginForm = formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    events.subscribe("loginSuccess", () => {
      this.viewController.dismiss({"success":true});
    });
  }


  login() {
    console.log("Login account");
    console.log(this.account);
    this.account.error = "";
    this.accountServices.login(this.account);
    
  }

  logout() {
    console.log("Logout account");
    this.accountServices.logout();
  }
}


