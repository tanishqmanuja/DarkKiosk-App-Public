import { Component, OnInit } from '@angular/core';
import { AtatService } from '@dk/services/atat.service';
import { StorageService } from '@dk/services/storage.service';
import { AlertController } from '@ionic/angular';
import { WebkioskService } from '@dk/services/webkiosk.service';
import { UtilService } from '@dk/services/util.service';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private atat:AtatService,
    private storage:StorageService,
    private alertCtrl:AlertController,
    private webkiosk:WebkioskService,
    private utils:UtilService
  ) { }

  ngOnInit() {
  }

  pickSemAndBatch(){
    this.atat.showPicker()
  }

  async changeAlias(){
    let userinfo = await this.storage.get('userinfo')
    
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      cssClass: 'settings-alert',
      header: 'Change Alias',
      message: 'Enter new alias',
      inputs: [
        {
          name: 'alias',
          type: 'text',
          placeholder: userinfo.alias,
          attributes: {
            maxlength: 10,
          }
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          handler: data => {
            userinfo.alias = data.alias
            this.storage.set('userinfo',userinfo)
            this.utils.presentToast('Alias Changed')
          }
        }
      ]
    });

    await alert.present();
  }

  async changeWKPass(){
    let userinfo = await this.storage.get('userinfo')
    
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      cssClass: 'settings-alert',
      header: 'Change Password',
      message: 'Enter new password for webkiosk',
      inputs: [
        {
          name: 'pass',
          type: 'text',
          placeholder: userinfo.pass,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          handler: data => {
            this.webkiosk.login(userinfo.enroll,data.pass,userinfo.dob).then(val=>{
              if(val){
                userinfo.pass = data.pass
                this.storage.set('userinfo',userinfo)
                this.utils.presentToast('Password Changed')
              } else {
                this.utils.presentToast('Invalid Password')
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async copyFCMKey(){
    let fcmtoken = await this.storage.get('fcmtoken')
    Clipboard.write({
      string: fcmtoken
    });
    this.utils.presentToast('FCM Token Copied')
  }

  async updateSem(){
    await this.webkiosk.updateSubjects()
    this.utils.presentToast('Subjects Updated')
  }

  async fsTimetable(){
    let tt;
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      cssClass: 'settings-alert',
      header: 'Cloud Timetable',
      message: 'Enter Timetable Code',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'code',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          handler: data => {
            tt = this.atat.getTimetableFromFS(data.code)
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss()
    tt = await tt
    if(tt.length){
      this.atat.setTimetable(tt)
    } else {
      console.log(tt)
      this.utils.presentToast('Invalid Timetable')
    }
  }

}
