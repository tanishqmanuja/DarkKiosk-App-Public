import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AttendanceDetailsPage } from '../attendance-details/attendance-details.page';
import { WebkioskService } from '@dk/services/webkiosk.service';
import { AtatService } from '@dk/services/atat.service';
import { UtilService } from '@dk/services/util.service';
import { StorageService } from '@dk/services/storage.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit,OnDestroy {
  days = this.utils.days.concat('sunday');
  atatData:any;
  selectedIndex = (new Date()).getDay() > 0 ? (new Date()).getDay() - 1 : 6
  timetable = [];
  attendance = [];
  arrayFn = Array;
  currentClass;
  findClass$;
  noTimetable = false
  titleShortener = this.utils.titleShortener;

  constructor(
    private atat:AtatService,
    private webkiosk:WebkioskService,
    private modalCtrl:ModalController,
    private utils: UtilService,
    private storage: StorageService
    ) { }

  async ngOnInit() {
    this.atatData = await this.storage.get('userinfo')
    this.timetable = await this.atat.getTimetable()
    this.webkiosk.getAttendance$().subscribe(a=>{
      this.attendance = a.data
    })
    if(this.findClass$) return;
    this.findClass$ = this.atat.getCurrentClasses().subscribe(async (classes) =>{
      if(!this.atatData) this.atatData = await this.storage.get('userinfo');
      if(this.timetable.length==0) this.timetable = await this.atat.getTimetable();
      
      this.currentClass = classes[0];
    })
  }

  ngOnDestroy(){
    this.findClass$.unsubscribe();
  }

  changeDay(index:number){
    if(index>=7){
      this.selectedIndex = 0
    } else if(index<0){
      this.selectedIndex = 6
    } else {
      this.selectedIndex = index;
    }
  }

  async checkSemester(){
    let timetableSemCode = (this.atat.getMetaInfo()).semCode
    let subjectSemCode = (await this.webkiosk.getSubjects()).data[0].semCode
    if(timetableSemCode != subjectSemCode){
      this.noTimetable = true;
    }
  }

  getCurrentPeriods(){
    if(this.timetable && this.selectedIndex!=null) return this.timetable.filter((val)=>val.day==this.days[this.selectedIndex]).sort((a,b)=>a.time-b.time)
    else return []
  }

  formatTime(str){
    let time = parseInt(str)
    if(time<12) return [time,'am'];
    else if(time==12) return [time,'pm'];
    else return [time-12,'pm'];
  }

  getAttendance(code){
    let codeCorrect = (a,b)=>{
      if(a.substring(0,3)==b.substring(0,3) && a.substring(5)==b.substring(5)){
        return true;
      } else {
        return false;
      }
    }
    let data = this.attendance.filter(val=>(val.course.code==code||codeCorrect(val.course.code,code)))[0];
    if(data){
      return data.attendance.total || data.attendance.prac
    } else {
      return 0;
    }
  }

  async openDetails(code){
    let codeCorrect = (a,b)=>{
      if(a.substring(0,3)==b.substring(0,3) && a.substring(5)==b.substring(5)){
        return true;
      } else {
        return false;
      }
    }
    let data = this.attendance.filter(val=>(val.course.code==code||codeCorrect(val.course.code,code)))[0];
    const modal = await this.modalCtrl.create({
      component: AttendanceDetailsPage,
      componentProps: {
        data: data
      },
      cssClass:'attendance-modal'
    });
    if(data) modal.present();
  }

  async handlePicker(){
    await this.atat.showPicker()
    this.atatData = await this.storage.get('userinfo')
    this.timetable = await this.atat.getTimetable()
  }

  async doRefresh(event) {
    await this.webkiosk.updateAttendanceDeatiled()
    await this.ngOnInit()
    event.target.complete()
  }

}
