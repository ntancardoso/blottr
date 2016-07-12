import {Storage, SqlStorage, Events} from "ionic-angular";
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import app_config = require('../../globals');


/**
 * Performs authentication on Drupal backend
 * 
 **/
@Injectable()
export class AccountService {
  http: Http;
  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  db: Storage = new Storage(SqlStorage);

  constructor(http: Http,
    private events: Events) {
    this.http = http;
  }


  /**
    * Fetches the Drupal token
    */
  token() {
    return this.http.post(app_config.api_url + app_config.token, '', { headers: this.headers });
  }


  /**
    * Login to server without callback
    * @param model with username and password
    */
  simpleLogin(model) {
    return this.http.post(app_config.api_url + app_config.login, JSON.stringify(model), { headers: this.authHeaders(this.headers) });
  }


  /**
    * Login to server using session authentication. Currently doesn't work since setting cookie on header is not allowed
    * @param model with username and password
    */
  login(model) {

    return this.http.post(app_config.api_url + app_config.login, JSON.stringify(model), { headers: this.authHeaders(this.headers) }).subscribe(
      data => {
        if (app_config.is_debug)
          console.log(data);

        // Store returned token and session cookie
        let resp = JSON.parse(JSON.parse(JSON.stringify(data))._body);
        localStorage.setItem("token", resp.token);
        localStorage.setItem("cookie", resp.session_name + "=" + resp.sessid);

        this.db.setJson("account", model);
        this.events.publish("loginSuccess");
      },
      error => {
        console.log("login error");
        if (app_config.is_debug)
          console.log(error);
        model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
      }
    );
  }


  /**
    * Login using Drupal's Services Token module.
    * @param model with username and password
    */
  tokenLogin(model) {
    // Get CSRF Token
    return this.http.post(app_config.api_url + app_config.token, '', { headers: this.authHeaders(this.headers) }).subscribe(
      data => {
        if (app_config.is_debug)
          console.log(data);

        // Use token as X-CSRF-Token header   
        localStorage.setItem("token", JSON.parse(JSON.parse(JSON.stringify(data))._body).token);
        this.headers = this.authHeaders(this.headers);

        // Set user credentials as Authorization header
        this.headers.set("Authorization", "Basic " + btoa(model.username + ":" + model.password));

        // Submit user credentials to Service Token module to generate service token
        this.http.post(app_config.api_url + app_config.service_token, '', { headers: this.headers }).subscribe(
          data => {

            // Replace Authorization header with the generated service token
            localStorage.setItem("service_token", JSON.parse(JSON.parse(JSON.stringify(data))._body).token);
            this.headers = this.authHeaders(this.headers);

            if (app_config.is_debug)
              console.log(data);

            // Store user credentials on App DB
            this.db.setJson("account", model);

            // Notify Login Success subscribers
            this.events.publish("loginSuccess");

          },
          error => {
            console.log("login error");

            if (app_config.is_debug)
              console.log(error);

            // Set account.error to display error message on screen
            model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
          }
        );


      },
      error => {
        console.log("Error getting CSRF token");
      }

    );
  }


  /**
    * Logout by calling logout url
    */
  logout() {
    this.http.post(app_config.api_url + app_config.logout, "", { headers: this.headers }).subscribe(
      data => {
        console.log("logout");
        if (app_config.is_debug)
          console.log(data);

        // Remove user credentials on App DB
        this.db.remove("account");

        // Notify Logout Success subscribers
        this.events.publish("logoutSuccess");
      }

    );
  }


  /**
    * Create a new user on Drupal backend
    * @param user account model
    */
  createAccount(model) {
    // Get CSRF Token
    return this.http.post(app_config.api_url + app_config.token, '', { headers: this.authHeaders(this.headers) }).subscribe(
      data => {
        if (app_config.is_debug)
          console.log(data);

        // Use token as X-CSRF-Token header   
        localStorage.setItem("token", JSON.parse(JSON.parse(JSON.stringify(data))._body).token);
        this.headers = this.authHeaders(this.headers);

        let registerData = {
          "name": model.username,
          //"password": model.password,
          "mail": model.email,
          "field_contact_numbers": {
            "und": [
              { "value": model.contact_no }
            ]
          }
        }

        // Submit new user for registration
        this.http.post(app_config.api_url + app_config.register, JSON.stringify(registerData), { headers: this.headers }).subscribe(
          data => {

            if (app_config.is_debug)
              console.log(data);

            this.events.publish("registerSuccess");

          },
          error => {
            console.log("register error");

            if (app_config.is_debug)
              console.log(error);

            // Set account.error to display error message on screen
            model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
          }
        );


      },
      error => {
        console.log("Error getting CSRF token");
      }

    );
  }


  /**
    * Updates headers if available
    */
  public authHeaders(headers: Headers) {
    if (!(localStorage.getItem("token") === undefined) && localStorage.getItem("token") != null && localStorage.getItem("token") != "")
      headers.set('X-CSRF-Token', localStorage.getItem("token"));
    if (!(localStorage.getItem("service_token") === undefined) && localStorage.getItem("service_token") != null && localStorage.getItem("service_token") != "")
      headers.set('Authorization', "Basic " + btoa(localStorage.getItem("service_token") + ":"));
    // Cookie header is required to use same session in Drupal by default. This is not working because setting Cookie header is not allowed.
    // if(localStorage.getItem("cookie")!==undefined && localStorage.getItem("cookie")!="")
    //   this.headers.set('Authorization',localStorage.getItem("cookie"));
    if (app_config.is_debug)
      console.log(headers);
    return headers;
  }

}