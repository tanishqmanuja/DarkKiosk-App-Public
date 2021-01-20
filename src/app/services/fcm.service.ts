import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed, 
  Capacitor} from '@capacitor/core';
import { WebkioskService } from './webkiosk.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';

let pushNotifications:any;
  if (Capacitor.platform !== "web") {
    pushNotifications = Plugins.PushNotifications
}

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  constructor(
    private platform: Platform,
    private storage: StorageService,
    private webkiosk: WebkioskService,
  ) { }

  async initFCM(){
    if(!this.platform.is("android") || !pushNotifications) return;

    let prevToken = await this.storage.get('fcmtoken')
    
    pushNotifications.requestPermission().then( result => {
      if (result.granted) {
        pushNotifications.register();
        pushNotifications.removeAllDeliveredNotifications()
        pushNotifications.createChannel({
          id: '5',
          name: 'Marks',
          importance: 4,
          lights: true,
          lightColor: '#9966cc',
          vibration: true
        })
        pushNotifications.createChannel({
          id: '6',
          name: 'Attendance',
          importance: 4,
          lights: true,
          lightColor: '#9966cc',
          vibration: true
          
        })
        pushNotifications.createChannel({
          id: '7',
          name: 'CGPA & Grades',
          importance: 5,
          lights: true,
          lightColor: '#9966cc',
          vibration: true
        })
      }
    });

    pushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        if(prevToken!==token.value){
          this.storage.set('fcmtoken',token.value)
       }
      }
    );

    pushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    pushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    pushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push Title: ',notification.notification.title)
        if(notification.notification.title.includes('Marks')){
          //this.webkiosk.updateMarksLatest()
        } else if (notification.notification.title.includes('Attendance')){
          this.webkiosk.updateAttendanceDeatiled
        }
      }
    );
  }
}
