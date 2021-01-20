import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { StorageService } from '@dk/services/storage.service';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit,AfterViewInit {
  title = 'DarkKiosk'.split('');
  subtitle = 'PREMIUM'.split('');

  constructor(private navCtrl:NavController,private storage:StorageService) { }

  ngOnInit() {}
  
  async ngAfterViewInit(){
    SplashScreen.hide().catch((err)=>{})
    let info = await this.storage.get('userinfo')
    setTimeout(()=>{
      if(info && info.base64auth){
        this.navCtrl.navigateRoot('home')
      } else {
        this.navCtrl.navigateRoot('login')
      }
    },2500)
  }

  titleDelay(index){
    return 400 + index*100;
  }

  subtitleDelay(index){
    return 1200 + Math.abs(Math.floor(this.subtitle.length/2-index))*100;
  }

}
