import { Component, OnInit, ViewChild } from '@angular/core';
import { AtatService } from 'src/app/services/atat.service';
import { UtilService } from 'src/app/services/util.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EditPage } from './edit/edit.page';
import { StorageService } from '@dk/services/storage.service';

@Component({
  selector: 'app-schedule-editor',
  templateUrl: './schedule-editor.page.html',
  styleUrls: ['./schedule-editor.page.scss'],
})
export class ScheduleEditorPage implements OnInit {
  
  @ViewChild('slides', {static: true}) slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    threshold: 25,
    autoHeight: true
  };
  
  selectedDay = "monday";
  selectedIndex = 0
  timetable = [];
  titleShortener = this.utils.titleShortener;

  constructor(
    private atat: AtatService,
    private utils: UtilService,
    private storage: StorageService,
    private modalCtrl: ModalController,
    private toastController:ToastController
  ) {}

  async ngOnInit() {
    await this.mapTimetable()
    this.slides.update();
  }

  slideChanged(e: any) {
    this.slides.getActiveIndex().then((index: number) => {
        this.selectedIndex = index;
        this.selectedDay = this.utils.days[index];
    });
  }

  async mapTimetable(reset?:boolean){
    let timetable = await this.atat.getTimetable(reset);
    if(!(timetable.length>0)) return;
    let mappedTimetable = new Array(48);
    let days = this.utils.days;
    timetable.forEach(data => {
      let dayIndex = days.indexOf(data.day);
      let timeIndex = parseInt(data.time)-9;
      let dataIndex = dayIndex*8 + timeIndex;
      mappedTimetable[dataIndex]=data;
    });
    for(let i=0;i<days.length;i++){
      this.timetable[i] = mappedTimetable.slice(8*i,8*i+8).filter(val=>val);
    }
  }

  reMapTimetable(){
    let timetable = [].concat(...this.timetable);
    if(!(timetable.length>0)) return;
    let mappedTimetable = new Array(48);
    let days = this.utils.days;
    timetable.forEach(data => {
      let dayIndex = days.indexOf(data.day);
      let timeIndex = parseInt(data.time)-9;
      let dataIndex = dayIndex*8 + timeIndex;
      mappedTimetable[dataIndex]=data;
    });
    for(let i=0;i<days.length;i++){
      this.timetable[i] = mappedTimetable.slice(8*i,8*i+8).filter(val=>val);
    }
  }

  async saveTimetable(){
    let timetable = [].concat(...this.timetable);
    await this.storage.set('timetable',timetable);
    this.presentToast()
  }

  formatTime(str){
    let time = parseInt(str)
    if(time<12) return [time,'am'];
    else if(time==12) return [time,'pm'];
    else return [time-12,'pm'];
  }

  async openEdit(data?:any,i?:number,j?:number){
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps: {
        data: data
      },
      cssClass:'edit-modal'
    });
    modal.present();
    let newData = await modal.onDidDismiss()
    if(!newData.data) return;
    if(data && i!=undefined && j!=undefined && newData.data){
      this.timetable[i][j] = newData.data;
    }else if(data && i!=undefined && j!=undefined && typeof newData.data === 'object'){
      this.timetable[i][j] = null;
    }else {
      this.timetable[0].push(newData.data)
    }
    this.reMapTimetable()
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your schedule have been saved.',
      duration: 2000,
      cssClass: 'toastStyle'
    });
    toast.present();
  }
} 
