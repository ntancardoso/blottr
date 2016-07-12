import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/common";
import {NavController, ViewController, Events} from 'ionic-angular';
import {Account} from '../../models/account';
import {AccountService} from '../../services/account-service/account-service';


/**
 *  Login Page
 * 
 **/
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

    // Setup validation
    this.account = new Account();
    this.loginForm = formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    events.subscribe("loginSuccess", () => {
      this.viewController.dismiss({ "success": true });
    });

    localStorage.clear();
  }


  /**
    * Authenticate using login page's form
    */
  login() {
    console.log("Login account");
    this.account.error = "";
    this.accountServices.tokenLogin(this.account);
  }

  /**
    * Logout user
    */
  logout() {
    console.log("Logout account");
    this.accountServices.logout();
  }

  /**
  * Cancel
  */
  cancel() {
    console.log("Cancel Sign In");
    this.viewController.dismiss({ "cancel": false });
  }
}


