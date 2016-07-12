import {Component, ViewChild} from '@angular/core';
import {NavController, Modal, Slides} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {RegisterPage} from '../register/register';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/intro/intro.html'
})
export class IntroPage {
  @ViewChild('introSlider') slider: Slides;

  constructor(private navController: NavController) {

  }

  loginPage() {
    let modalPage = Modal.create(LoginPage);
    modalPage.onDismiss(
      data => {
        console.log(data);
        
        if(data.success==true) {
          console.log("data true");
          this.navController.setRoot(TabsPage);
        } else {
          console.log("data not true");
        }
    });
    this.navController.present(modalPage);
  }

  registerPage() {
    let modalPage = Modal.create(RegisterPage);
    this.navController.present(modalPage);
  }

  nextSlide() {
    this.slider.slideNext();
  }
}
