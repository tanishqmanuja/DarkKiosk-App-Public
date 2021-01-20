import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { FcmService } from './services/fcm.service';
import { Platform } from '@ionic/angular';
const { StatusBar,ScreenOrientation } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private fcm: FcmService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({
        overlay: true
      }).catch((err)=>{});
      this.lockOrientation()
      //this.fcm.initFCM();
    });
  }

  async lockOrientation() {
    if(this.platform.is("capacitor")){
      await ScreenOrientation.lockScreenOrientation({orientation: 'PORTRAIT_PRIMARY'});
    }
  }
}
