import {Component} from '@angular/core';
import {Platform, ionicBootstrap, Storage, LocalStorage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {IntroPage } from './pages/intro/intro';
import {IncidentService} from "./services/incident-service/incident-service";
import {AccountService} from "./services/account-service/account-service";
import {Account} from "./models/account";


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [IncidentService,AccountService]
})
export class Blottr {

  private rootPage: any;
  db: Storage;
  account: Account;

  constructor(private platform: Platform) {
    //this.rootPage = TabsPage;

    platform.ready().then(() => {

      this.db = new Storage(SqlStorage);
      
      this.db.get("account").then(data => {
          if(data !== undefined) {
            console.log(data);
            console.log("show home");
            //this.account = JSON.parse(data);
            //console.log(this.account);
            this.rootPage = TabsPage;
          } else {
            console.log("show intro");
            this.rootPage = IntroPage;
          }
          
          
        },
        error => {
          console.log(error);
        }
      );

      //If user credentials not in DB show login/register screen



      StatusBar.styleDefault();
    });
  }

  reset() {
    this.db.remove("account");
  }


}

ionicBootstrap(Blottr)
