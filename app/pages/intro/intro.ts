import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NavController, Modal, Slides} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {RegisterPage} from '../register/register';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/intro/intro.html'
})
export class IntroPage {
  @ViewChild('introSlider') slider: Slides;

  constructor(private navController: NavController,
    private _elementRef: ElementRef) {

  }

  /**
   *  Temporary fix for beta10 slider bug
   *  https://github.com/GerritErpenstein/ionic2-slides-temp-fix
   */
  public ngOnInit() {
    let swiperContainer = this._elementRef.nativeElement.getElementsByClassName('swiper-container')[0];
    this.waitRendered(swiperContainer).then(() => {
      let swiper = this.slider.getSlider();
      swiper.update();
    });
  }

  waitRendered(element: HTMLElement): Promise<HTMLElement> {
    return new Promise((resolve) => {
      let checkNextFrame = () => {
        requestAnimationFrame(() => {
          if (element.clientWidth)
            resolve(element);
          else
            checkNextFrame();
        });
      };
      checkNextFrame();
    });
  }


  loginPage() {
    let modalPage = Modal.create(LoginPage);
    modalPage.onDismiss(
      data => {
        console.log(data);

        if (data.success == true) {
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
