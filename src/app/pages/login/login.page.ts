import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { WebkioskService } from '@dk/services/webkiosk.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  rocketTop = -5;
  @ViewChild('slides', {static: true}) slides: IonSlides;
  
  slideOpts = {
    initialSlide: 0,
    allowTouchMove: false,
    speed: 400
  };

  constructor(
    private webkiosk: WebkioskService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  wkLoggedIn($event){
    if($event) this.slides.slideTo(1)
    return
  }

  async triggerBlastOff($event){
    if($event) this.rocketTop = 90
    
    let promisesBasic = [
      this.webkiosk.updateSubjects(),
      this.webkiosk.updateAttendance()
    ]
    console.log('basic-started')
    await Promise.all(promisesBasic);
    console.log('basic-done')
    
    let promisesAdv = [
      this.webkiosk.updateMarks(),
      this.webkiosk.updateGrades(),
      this.webkiosk.updatePoints()
    ]
    console.log('advanced-started')
    await Promise.all(promisesAdv);
    console.log('advanced-done')

    this.navCtrl.navigateRoot('home')
    return;
  }
}
