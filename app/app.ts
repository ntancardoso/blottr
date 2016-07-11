import {Component, enableProdMode} from '@angular/core';
import {Platform, ionicBootstrap, Storage, LocalStorage, SqlStorage, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {IntroPage } from './pages/intro/intro';
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

  constructor(private platform: Platform,
    private accountService: AccountService,
    private locationService: LocationService,
    private events: Events) {

    this.rootPage = IntroPage;

    platform.ready().then(() => {

      this.db = new Storage(SqlStorage);

      // Uncomment to reset the app
      //this.reset();

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

      this.locationService.refreshCurrentLocation();

      this.events.subscribe("loginSuccess", () => {
        this.rootPage = TabsPage;
      });

      // Check if existing user
      this.db.get("account").then(data => {
        if (data !== undefined) {

          //TODO Implement offline mode if there is no network connection
          this.accountService.tokenLogin(JSON.parse(data));

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
}


if (!app_config.is_debug)
  enableProdMode();

ionicBootstrap(Blottr)