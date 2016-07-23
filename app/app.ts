import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap, Storage, LocalStorage, SqlStorage, Events} from 'ionic-angular';
import {Facebook} from 'ionic-native';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {IntroPage } from './pages/intro/intro';
import {BlankPage } from './pages/blank/blank';
import {IncidentService} from "./services/incident-service/incident-service";
import {AccountService} from "./services/account-service/account-service";
import {LocationService} from "./services/location-service/location-service";
import {Account} from "./models/account";
import app_config = require('./globals');


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [IncidentService, AccountService, LocationService]
})
export class Blottr {

  private rootPage: any;
  db: Storage;
  account: Account;
  startTime: number = new Date().getTime();

  constructor(private platform: Platform,
    private accountService: AccountService,
    private locationService: LocationService,
    private events: Events) {


    if (app_config.is_debug) {
      console.log("App Started: " + new Date());
      let p = this.platform.platforms();
      for(let i in p)
        console.log(p[i]); 

    }
    this.rootPage = BlankPage;

    this.events.subscribe("loginSuccess", () => {
      this.rootPage = TabsPage;
    });

    platform.ready().then(() => {
      if (app_config.is_debug)
        console.log("Platform Ready: " + this.getElapsedTime());
      this.db = new Storage(SqlStorage);

      if(app_config.app_reset)
        this.reset();

      this.initApp();

      StatusBar.styleDefault();
    });
  }


  /**
    * Call this to reset the user credentials from the app while debugging
    */
  reset() {
    this.db.remove("account");
  }

  initApp() {
    if (app_config.is_debug)
      console.log("Init App: " + this.getElapsedTime());
    this.locationService.refreshCurrentLocation();

    if (app_config.is_debug)
      console.log("Location Ready: " + this.getElapsedTime());


    // Check if existing user
    this.db.get("account").then(data => {
      if (app_config.is_debug)
        console.log("Data Ready: " + this.getElapsedTime());
      if (data !== undefined) {

        //TODO Implement offline mode if there is no network connection
        if(data.isFB)
          this.accountService.fbLogin(JSON.parse(data));
        else
          this.accountService.tokenLogin(JSON.parse(data));
        if (app_config.is_debug)
          console.log("After Login: " + this.getElapsedTime());
      } else {
        // Display intro page for new users w/c allows them to register/login
        this.rootPage = IntroPage;
      }
    },
      error => {
        console.log("DB Failure");
      }
    );
  }

  getElapsedTime() {
    return ((new Date().getTime() - this.startTime) / 1000) + " sec";
  }

}




if (!app_config.is_debug)
  enableProdMode();

ionicBootstrap(Blottr)