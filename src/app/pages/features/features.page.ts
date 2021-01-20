import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-features',
  templateUrl: './features.page.html',
  styleUrls: ['./features.page.scss'],
})
export class FeaturesPage implements OnInit {

  constructor(
    private navCtrl:NavController,
  ) { }

  ngOnInit() {
  }

  async openPage(pagename){
      this.navCtrl.navigateForward('/'+pagename)
  }
  
}
