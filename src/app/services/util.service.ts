import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  times = [9,10,11,12,13,14,15,16];

  constructor(
    private toastController:ToastController
  ) { }

  titleShortener(str,max=30) {
    if (str.length > max) {
      let arr = str.split(" ");
      let short = "";
      arr.forEach((x, i) => {
        if (x != arr[arr.length - 1]) {
          if (x == "and" || x == "And" || x == "AND") {
            short = short + "& ";
          } else {
            short = short + x[0].toUpperCase() + ". ";
          }
        }
      });
      return short + arr[arr.length - 1];
    } else {
      return str;
    }
  }

  async presentToast(message:string,duration?:number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration || 1500,
      cssClass: 'toastStyle'
    });
    toast.present();
  }
}
