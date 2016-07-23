import {Storage, SqlStorage, Events, Platform} from "ionic-angular";
import {Facebook} from 'ionic-native';
import {Injectable} from "@angular/core";
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
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
    private events: Events,
    private platform: Platform) {
    this.http = http;
  }


  /**
    * Fetches the X-CSRF-Token from drupal service
    */
  getToken() {
    return Observable.create(observer => {
      this.http.post(app_config.api_url + app_config.token, '', { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
        tokenResponse => {
          // Use token as X-CSRF-Token header
          let myToken = JSON.parse(JSON.parse(JSON.stringify(tokenResponse))._body).token;
          this.saveCredentials({ "token": myToken });
          observer.next(myToken);
          observer.complete();
        },
        error => {
          console.log("Error getting CSRF token");
        }
      );
    });
  }


  /**
     * Save credentials for authentication
     * @param obj with fields token:string, cookie:string, account:Account
     */
  saveCredentials(params: any) {
    if (params.token)
      localStorage.setItem("token", params.token);
    if (params.cookie)
      localStorage.setItem("cookie", params.cookie);
    if (params.account)
      this.db.setJson("account", params.account);
  }


  /**
    * Login to server without callback
    * @param model with username and password
    */
  simpleLogin(model) {
    return this.http.post(app_config.api_url + app_config.login, JSON.stringify(model), { headers: this.authHeaders(this.headers) });
  }


  /**
    * Login to server using session authentication cookie. 
    * @param model with username and password
    */
  login(model) {

    if (app_config.is_debug)
      console.log("Default service login");

    model.isFB = false;

    this.getToken().subscribe(
      myToken => {
        // Login to drupal service
        this.http.post(app_config.api_url + app_config.login, JSON.stringify(model), { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
          data => {
            if (app_config.is_debug)
              console.log(data);

            // Store returned token and session cookie
            let resp = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            this.saveCredentials({ "token": resp.token, "cookie": resp.session_name + "=" + resp.sessid, "account": model });
            this.events.publish("loginSuccess");
          },
          error => {
            let loginError = String(JSON.parse(JSON.parse(JSON.stringify(error))._body));
            if (app_config.is_debug)
              console.log(error);
            if (loginError.startsWith('Already logged in as ')) {
              this.logout().subscribe(
                logoutData => {
                  this.login(model);
                }
              );
            }
            else {
              console.log("login error");
              model.error = loginError;
            }

          }
        );
      },
      error => console.log("Error getting CSRF token"));
  }


  /**
    * Login using Drupal's Services Token module.
    * @param model with username and password
    */
  tokenLogin(model) {

    if (app_config.is_debug)
      console.log("Service Token module login");

    model.isFB = false;

    this.getToken().subscribe(
      myToken => {

        // Set user credentials as Authorization header
        this.headers.set("Authorization", "Basic " + btoa(model.username + ":" + model.password));

        // Submit user credentials to Service Token module to generate service token
        this.http.post(app_config.api_url + app_config.service_token, '', { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
          data => {

            if (app_config.is_debug)
              console.log(data);

            // Replace Authorization header with the generated service token
            localStorage.setItem("service_token", JSON.parse(JSON.parse(JSON.stringify(data))._body).token);
            this.headers = this.authHeaders(this.headers);

            this.saveCredentials({ "account": model });

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
      }
    );
  }



  /**
    * Login using Drupal's FBOAUTH module.
    * @param model with username and password
    */
  fbLogin(model) {

    if (app_config.is_debug)
      console.log("FB OAuth module login");

    model.isFB = true;

    this.getToken().subscribe(
      myToken => {

        // Native Facebook login
        Facebook.login(app_config.fb_permissions).then(
          userData => {
            if (app_config.is_debug)
              console.log("FB UserInfo: ", userData);

            Facebook.getAccessToken().then(token => {
              if (app_config.is_debug)
                console.log("FB Token: " + token);

              // Pass FB access_token to FB OAuth service
              this.http.post(app_config.fboauth_url, JSON.stringify({ "access_token": token }), { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
                data => {
                  if (app_config.is_debug)
                    console.log(data);

                  // Store returned token and session cookie
                  let resp = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                  this.saveCredentials({ "token": resp.token, "cookie": resp.session_name + "=" + resp.sessid, "account": model });
                  //this.headers = this.authHeaders(this.headers);
                  //this.events.publish("loginSuccess");

                  // Generate Service Token because setting of cookie is not allowed
                  this.http.post(app_config.api_url + app_config.service_token, '', { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
                    data => {

                      if (app_config.is_debug)
                        console.log(data);

                      // Replace Authorization header with the generated service token
                      localStorage.setItem("service_token", JSON.parse(JSON.parse(JSON.stringify(data))._body).token);
                      this.headers = this.authHeaders(this.headers);

                      this.saveCredentials({ "account": model });

                      // Notify Login Success subscribers
                      this.events.publish("loginSuccess");

                    },
                    error => {
                      console.log("login error");

                      if (app_config.is_debug)
                        console.log(error);

                      // Set account.error to display error message on screen
                      model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
                    });

                },
                error => {
                  console.log("login error");
                  if (app_config.is_debug)
                    console.log(error);
                  model.error = JSON.parse(JSON.parse(JSON.stringify(error))._body);
                });
            },
              error => {
                if (app_config.is_debug)
                  console.log(error);

                console.log("FB Access Token error");
                model.error = "FB Access Token error";
              });
          },
          error => {
            if (app_config.is_debug)
              console.log(error);
            console.log("FB Login failed");
            model.error = "FB Login failed";
          }
        );
      }
    );
  }


  /**
    * Logout by calling logout url
    */
  logout() {

    return Observable.create(observer => {
      this.http.post(app_config.api_url + app_config.logout, "", { headers: this.authHeaders(this.headers), withCredentials: true }).subscribe(
        data => {
          console.log("logout");
          if (app_config.is_debug)
            console.log(data);

          // Remove user credentials on App DB
          this.db.remove("account");

          // Notify Logout Success subscribers
          this.events.publish("logoutSuccess");
          observer.next(data);
          observer.complete();
        }
      );
    });
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
        this.http.post(app_config.api_url + app_config.register, JSON.stringify(registerData), { headers: this.headers, withCredentials: true }).subscribe(
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
    if (!(localStorage.getItem("cookie") === undefined) && localStorage.getItem("cookie") != null && localStorage.getItem("cookie") != "")
      headers.set('Cookie', localStorage.getItem("cookie"));
    if (app_config.is_debug)
      console.log(headers);
    return headers;
  }


}