import { Component, OnInit } from '@angular/core';
import { WebkioskService } from '../../services/webkiosk.service';
import { ModalController } from '@ionic/angular';
import { AttendanceDetailsPage } from '../attendance-details/attendance-details.page';
import { UtilService } from '@dk/services/util.service';
import { Attendance } from '@dk/interfaces/webkioskAPI.interface';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  attendance:Attendance
  arrayFn = Array;
  titleShort = this.utils.titleShortener

  constructor(
    private webkiosk:WebkioskService,
    private modalCtrl:ModalController,
    private utils:UtilService
    ) { }

  async ngOnInit() {
    this.webkiosk.getAttendance$().subscribe(a=>{
      this.attendance = a;
    })
  }

  async openDetails(code){
    let codeCorrect = (a,b)=>{
      if(a.substring(0,3)==b.substring(0,3) && a.substring(5)==b.substring(5)){
        return true;
      } else {
        return false;
      }
    }
    let data = this.attendance.data.filter(val=>(val.course.code==code||codeCorrect(val.course.code,code)))[0];
    const modal = await this.modalCtrl.create({
      component: AttendanceDetailsPage,
      componentProps: {
        data: data
      },
      cssClass:'attendance-modal'
    });
    if(data) modal.present();
  }

  getTotalAttendance(a){
    if(a.total) return parseInt(a.total);
    else if(a.prac) return parseInt(a.prac);
    else if(a.lec) return parseInt(a.lec);
    else if(a.tut) return parseInt(a.tut)
    else return 0;
  }

  getAttendanceColor(a){
    let total = this.getTotalAttendance(a)
    if(total>75) return 'var(--ion-green)'
    else if(total>60) return 'var(--ion-yellow)'
    else return 'var(--ion-red)'
  }

  async doRefresh(event) {
    await this.webkiosk.updateAttendanceDeatiled()
    event.target.complete()
  }

}
