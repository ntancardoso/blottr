import {Component} from '@angular/core'
import {HomePage} from '../home/home';
import {AlertPage} from '../alert/alert';
import {DisclosePage} from '../disclose/disclose';
import {PreventPage} from '../prevent/prevent';


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;


  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AlertPage;
    this.tab3Root = DisclosePage;
    this.tab4Root = PreventPage;
  }
}
