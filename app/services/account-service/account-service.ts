import {Storage, SqlStorage, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import app_config = require('../../globals');


@Injectable()
export class AccountService {
  http: Http;
  headers: Headers =  new Headers({ 'Content-Type': 'application/json'});


  constructor(http: Http,
    public events: Events) {
    this.http = http;
  }


  token() {
    return this.http.post(app_config.api_url+app_config.token,'',{ headers: this.headers });
  }


  login2(model) {
    this.checkHeaders();
    console.log(this.headers);
    return this.http.post(app_config.api_url+app_config.login, JSON.stringify(model), { headers: this.headers });
  }

  login(model) {
    this.checkHeaders();
    console.log(this.headers);
    return this.http.post(app_config.api_url+app_config.login, JSON.stringify(model), { headers: this.headers }).subscribe(
      data => {
        console.log(data);
        let resp = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        localStorage.setItem("token", resp.token);
        localStorage.setItem("cookie", resp.session_name+"="+resp.sessid);
        //this.db.setJson("account",model);
        this.events.publish("loginSuccess");

      },
      error => {
        console.log("login  error");
        console.log(error);
        model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
      }
    );
  }


  logout() {
    console.log("logout "+this.headers.get('X-CSRF-Token'));
    return this.http.post(app_config.api_url+app_config.logout, "", { headers: this.headers });
  }

  createAccount() {

  }

  checkHeaders() {
    if(localStorage.getItem("token")!==undefined && localStorage.getItem("token")!="")
      this.headers.set('X-CSRF-Token',localStorage.getItem("token"));
    if(localStorage.getItem("cookie")!==undefined && localStorage.getItem("cookie")!="")
      this.headers.set('Authorization',localStorage.getItem("cookie"));
  }

}